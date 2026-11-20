# IA local en Kaggle (PB-10)

El backend analiza las alertas de fraude con una IA propia: Ollama en un cuaderno de Kaggle con GPU. Kaggle no acepta conexiones entrantes, así que el cuaderno abre un **túnel SSH inverso** hacia el EC2. Si el túnel o Kaggle no están, el backend usa Groq (`GROQ_API_KEY`) y, si también falla, la alerta queda «Análisis pendiente».

```
Kaggle: Ollama 127.0.0.1:11434 ──ssh -R──▶ EC2: 172.17.0.1:11434 ◀── contenedor api (host.docker.internal)
```

## 1. Llaves (una vez, en tu máquina)

```bash
ssh-keygen -t ed25519 -f tunel -N "" -C kaggle-uniride
ssh-keyscan -t ed25519 54.84.94.49 > known_hosts_tunel
```

- En Kaggle → Add-ons → Secrets: `TUNNEL_KEY` = contenido de `tunel` (privada) y `TUNNEL_KNOWN_HOSTS` = contenido de `known_hosts_tunel`.
- `tunel.pub` va al EC2 (paso 2). Borra `tunel` de tu máquina cuando esté en Kaggle. Nunca al repositorio.

## 2. EC2 (por SSM, una vez) — hecho el 20/11/2026 en `i-05b763d4d152d8eb9`

```bash
sudo useradd -m -s /usr/sbin/nologin tunel
sudo install -d -m 700 -o tunel -g tunel /home/tunel/.ssh
# Una sola línea: solo puede reenviar ese puerto, sin shell ni nada más.
echo 'restrict,port-forwarding,permitlisten="172.17.0.1:11434" ssh-ed25519 AAAA...contenido de tunel.pub... kaggle-uniride' \
  | sudo tee /home/tunel/.ssh/authorized_keys
sudo chown tunel:tunel /home/tunel/.ssh/authorized_keys && sudo chmod 600 /home/tunel/.ssh/authorized_keys

# Al final de sshd_config (no en sshd_config.d: un Match ahí alcanzaría al resto de la configuración).
sudo cp -p /etc/ssh/sshd_config /etc/ssh/sshd_config.bak-pb10
sudo tee -a /etc/ssh/sshd_config <<'EOF'
Match User tunel
  GatewayPorts clientspecified
  AllowTcpForwarding remote
  PermitTTY no
  X11Forwarding no
  AllowAgentForwarding no
  PasswordAuthentication no
  ForceCommand /usr/sbin/nologin
EOF
sudo sshd -t && sudo systemctl reload sshd
```

- Grupo de seguridad `sg-0b60c91dae631866f`: abrir **22/tcp** (las IP de Kaggle cambian; solo se entra con la llave). **No** abrir 11434.
- `/opt/desplegar-api.sh`: el contenedor `api` necesita `--add-host host.docker.internal:host-gateway`.
- SSM `/uniride/env`: `IA_LOCAL_URL=http://host.docker.internal:11434`, `IA_LOCAL_MODELO=qwen2.5:14b`, `IA_LOCAL_TIEMPO_MS=30000`. Después `bash /opt/desplegar-api.sh <etiqueta>`.

## 3. Kaggle (cada sesión)

1. Cuaderno nuevo → Accelerator **GPU T4 x2**, Internet **activado**, los dos secretos vinculados.
2. Pegar `kaggle.py` en una celda y «Save Version» → «Save & Run All». Corre en segundo plano `HOURS` horas (3 por defecto) e imprime «túnel abierto hacia tunel@54.84.94.49».
3. Comprobar desde el EC2: `curl -s http://172.17.0.1:11434/api/tags` lista el modelo.

Límites: una sesión dura como máximo 12 h y la GPU tiene unas 30 h por semana. Para la demo, encender el cuaderno antes; al apagarlo, el backend pasa solo a Groq (en Alertas se ve «Analizado por IA de respaldo»).
