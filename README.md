# TOTHL7
Servidor Hl7 para traspaso de informes

Install:

*- Linux Debian (Ubuntu)

    Borrar node mal instalado
        1.- sudo apt-get remove --purge nodejs npm

    Install NVM y NodeJs
        1.- wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.28.0/install.sh | bash

            # Seleccionar la ultima version
        2.- nvm ls-remote

            # El numero es la version a instalar
        3.- nvm install 4

            # Verificar version instalada
        4.- node -v 

            # Usar version correspondiente
        5.- nvm use 4 

            # Dejamos version por defecto
        6.- nvm alias default 4

            # Node Global
        7.- n=$(which node);n=${n%/bin/node}; chmod -R 755 $n/bin/*; sudo cp -r $n/{bin,lib,share} /usr/local

    O Update Nodejs

        El mismo procedimiento pero con la version que necesitemos


    INSTALAR Dependencias Globales

        1.- npm install -g babel

        2.- npm install -g babel-core

    Dependencias Projecto

        1.- npm install --save L7

        1.- npm install --save download-pdf

        1.- npm install --save pg-promise

-- Sequence: status_log_hl7_seq

-- DROP SEQUENCE status_log_hl7_seq;

CREATE SEQUENCE status_log_hl7_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 2
  CACHE 1;
ALTER TABLE status_log_hl7_seq
  OWNER TO postgres;


//TAbla

-- Table: status_log_hl7

-- DROP TABLE status_log_hl7;

CREATE TABLE status_log_hl7
(
  id bigint NOT NULL DEFAULT nextval('status_log_hl7_seq'::regclass),
  name character varying,
  CONSTRAINT status_log_hl7_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE status_log_hl7
  OWNER TO postgres;





-- Sequence: log_hl7_seq

-- DROP SEQUENCE log_hl7_seq;

CREATE SEQUENCE log_hl7_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;
ALTER TABLE log_hl7_seq
  OWNER TO postgres;

/////TABLACU
-- Table: log_hl7

-- DROP TABLE log_hl7;

CREATE TABLE log_hl7
(
  id bigint NOT NULL DEFAULT nextval('log_hl7_seq'::regclass),
  calendar bigint NOT NULL,
  message character varying,
  ack character varying,
  date timestamp without time zone,
  status bigint,
  CONSTRAINT log_hl7_pkey PRIMARY KEY (id),
  CONSTRAINT log_hl7_calendar_fkey FOREIGN KEY (calendar)
      REFERENCES calendar (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT log_hl7_status_fkey FOREIGN KEY (status)
      REFERENCES status_log_hl7 (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE log_hl7
  OWNER TO postgres;
