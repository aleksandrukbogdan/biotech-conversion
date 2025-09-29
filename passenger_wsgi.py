# 1. Абсолютный путь к папке вашего проекта.

project_path = '/var/www/u2886892/data/www/biotech-conversion.ru'

# 2. Абсолютный путь к папке с пакетами вашего виртуального окружения.
# Замените uXXXXXX, venv и python3.X на ваши значения.
venv_path = '/var/www/u2886892/data/www/biotech-conversion.ru/venv/lib/python3.9/site-packages'

# --------------------------

# Добавляем пути в системные пути Python
import sys
if venv_path not in sys.path:
    sys.path.insert(0, venv_path)

# Импортируем ваше Flask-приложение из файла app.py
# Переменная "app" в вашем файле app.py становится точкой входа.
from app import app as application
