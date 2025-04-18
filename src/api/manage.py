from flask_migrate import Migrate
from src.app import create_app
from src.models import db

app = create_app()
migrate = Migrate(app, db)

if __name__ == '__main__':
    app.run()