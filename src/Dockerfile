# Set up Python server
FROM python:3.8-alpine
RUN mkdir /app
ADD . /app
WORKDIR /app

# install psycopg2 dependencies
RUN apk update
RUN apk add postgresql-dev gcc python3-dev musl-dev

RUN pip install -r requirements.txt
EXPOSE 5000
# This uses the dev server and is NOT SECURE in production
CMD python3 -m flask run --host=0.0.0.0