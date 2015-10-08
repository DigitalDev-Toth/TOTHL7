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