NUM_WORKER=$1
BIND_ADDR=0.0.0.0:8096
gunicorn -w $NUM_WORKER -b $BIND_ADDR -p gunicorn.pid agent:app
