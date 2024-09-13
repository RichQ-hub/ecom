# small image for python (you will probably need to change this to a larger image + different version)
FROM python:3.11
# this is the working directory inside the container
WORKDIR /app
# copy all files from the current directory to the working directory
COPY . /app
# install dependencies from requirements.txt (put all your dependencies in requirements.txt)
RUN pip install --no-cache-dir -r requirements.txt
# installing the font for reports
COPY ./fonts ./
RUN mkdir -p /usr/share/fonts/truetype/
RUN install -m644 fonts/Roboto-Regular.ttf /usr/share/fonts/truetype/
RUN install -m644 fonts/Roboto-Bold.ttf /usr/share/fonts/truetype/
RUN install -m644 fonts/Roboto-Italic.ttf /usr/share/fonts/truetype/
RUN install -m644 fonts/Roboto-BoldItalic.ttf /usr/share/fonts/truetype/
RUN rm -rf ./fonts
RUN fc-cache -f -v
# expose port 5000 to the outside world (required to access the app at port 5000 however, we map this internal 5000 to an external port in the docker-compose file)
EXPOSE 5000
# command that is run to start the app (can be overriden in the docker-compose file)
# CMD ["python", "app.py"]

CMD ["python", "entrypoint.py"]

