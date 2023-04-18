pip3 install virtualenv  
virtualenv -p /usr/bin/python3 venv  
source venv/bin/activate  
pip3 install -r requirements.txt  
python3 ./restify/restify/manage.py makemigrations  
python3 ./restify/restify/manage.py migrate
