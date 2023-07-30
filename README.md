# noteManagementSystem
For Backend

cd  backend 
mac
source myvenv/bin/activate
pip3 install flask
pip3 install flask-cors
cd myvenv
python3  app.py

windows
cd  backend 
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\myvenv\Scripts\Activate
pip install flask
pip install flask-cors
cd myvenv
python  app.py

For Frontend
cd frontend
chmod +x node_modules/.bin/react-scripts
npm start 
