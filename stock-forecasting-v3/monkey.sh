NUM_WORKER=$1
NUM_CONNECTION=$2
BIND_ADDR=0.0.0.0:8096

gunicorn --timeout 30 --log-level=debug -w $NUM_WORKER -b $BIND_ADDR -k eventlet --worker-connections $NUM_CONNECTION agent
