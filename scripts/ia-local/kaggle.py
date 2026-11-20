"""
PB-10 · IA local de UniRide en un notebook de Kaggle (GPU T4, gratis).

Levanta Ollama en la GPU del notebook y abre un túnel SSH **inverso** hacia el EC2 de UniRide: allá,
`172.17.0.1:11434` (IP del puente de Docker) pasa a ser este Ollama, y el contenedor `api` lo alcanza
como `IA_LOCAL_URL=http://host.docker.internal:11434`. Si el notebook está apagado, el backend usa Groq.

No se abre ningún puerto del notebook: la conexión la inicia el notebook. La llave solo puede abrir ese
reenvío (`restrict,port-forwarding,permitlisten` en scripts/ia-local/README.md), sin shell.

Uso en Kaggle:
  1. Notebook nuevo → pegar este archivo en una celda.
  2. Settings: Accelerator «GPU T4 x2» (o P100) e Internet «On».
  3. Add-ons → Secrets: `TUNNEL_KEY` (llave privada del usuario `tunel`) y `TUNNEL_KNOWN_HOSTS`
     (la línea de `ssh-keyscan -t ed25519 54.84.94.49`).
  4. «Save Version» → «Save & Run All»: corre en segundo plano hasta `HOURS` horas (máximo de Kaggle: 12).
"""
import os
import subprocess
import time
import urllib.request

from kaggle_secrets import UserSecretsClient

EC2 = 'tunel@54.84.94.49'
# El EC2 escucha en la IP del puente de Docker, no en su localhost: el backend corre en un contenedor.
REENVIO = '172.17.0.1:11434:127.0.0.1:11434'
MODEL = 'qwen2.5:14b'  # entra en una T4; debe coincidir con IA_LOCAL_MODELO del backend
HOURS = 3  # cada hora descuenta de la cuota semanal de GPU (~30 h)

secrets = UserSecretsClient()
ssh_dir = os.path.expanduser('~/.ssh')
os.makedirs(ssh_dir, mode=0o700, exist_ok=True)
key = os.path.join(ssh_dir, 'tunnel')
# El campo de secretos de Kaggle puede perder los saltos de línea al pegar, y ssh rechaza la llave en
# una sola línea: se rearma el PEM.
HEAD, TAIL = '-----BEGIN OPENSSH PRIVATE KEY-----', '-----END OPENSSH PRIVATE KEY-----'
body = ''.join(secrets.get_secret('TUNNEL_KEY').replace(HEAD, '').replace(TAIL, '').split())
with open(key, 'w') as f:
    f.write('\n'.join([HEAD, *(body[i:i + 70] for i in range(0, len(body), 70)), TAIL]) + '\n')
os.chmod(key, 0o600)
known = os.path.join(ssh_dir, 'known_hosts')
with open(known, 'w') as f:
    f.write(secrets.get_secret('TUNNEL_KNOWN_HOSTS').strip() + '\n')

# El instalador de Ollama extrae con zstd, que la imagen de Kaggle no trae.
subprocess.run('apt-get install -y -qq zstd >/dev/null || (apt-get update -qq && apt-get install -y -qq zstd)', shell=True, check=True)
subprocess.run('curl -fsSL https://ollama.com/install.sh | sh', shell=True, check=True)
# Modelo siempre cargado y contexto explícito: el de fábrica trunca el prompt en silencio.
env = {**os.environ, 'OLLAMA_HOST': '127.0.0.1:11434', 'OLLAMA_KEEP_ALIVE': '-1', 'OLLAMA_CONTEXT_LENGTH': '8192'}
subprocess.Popen(['ollama', 'serve'], env=env)
for _ in range(60):
    try:
        urllib.request.urlopen('http://127.0.0.1:11434/api/version', timeout=2)
        break
    except OSError:
        time.sleep(1)
subprocess.run(['ollama', 'pull', MODEL], env=env, check=True)
# Precarga: el primer análisis real no paga la carga del modelo en la GPU.
subprocess.run(['ollama', 'run', MODEL, 'hola'], env=env, check=True, stdout=subprocess.DEVNULL)

deadline = time.time() + HOURS * 3600
while time.time() < deadline:
    print('túnel abierto hacia', EC2, flush=True)
    try:
        subprocess.run([
            'ssh', '-N', '-i', key,
            '-o', f'UserKnownHostsFile={known}', '-o', 'StrictHostKeyChecking=yes',
            '-o', 'ServerAliveInterval=30', '-o', 'ServerAliveCountMax=3',
            '-o', 'ExitOnForwardFailure=yes',
            '-R', REENVIO, EC2,
        ], timeout=max(1, deadline - time.time()))
    except subprocess.TimeoutExpired:
        break
    # Se cortó (red, reinicio del EC2): reintentar sin gastar la sesión.
    time.sleep(5)
print('fin de la sesión del nodo')
