FROM mongo:7

ENV MONGO_INITDB_DATABASE=backend-grupo-02

EXPOSE 27017

CMD ["mongod"]