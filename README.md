# PARANOID
A small and simple test web chat... build for study porpuse.

### Technology

 * **Electron**: Simple and great way to '*Build cross platform desktop apps with web technologies*';
 * **Nodejs**: '*JavaScript runtime built on Chrome's V8 JavaScript engine*'. Its our web server that will run javascript code in the backend for us;
 * **npm**: '*npm is the package manager for*' nodejs and other javascript technologies;
 * **PostgreSQL**: '*A powerful, open source object-relational database system*'. This will be our database backend!

### Nodejs / Javascript libs *(most important ones)*
* **expressjs**: *Fast, unopinionated, minimalist web framework*;
* **socket.io**: *The fastest and most reliable real-time engine*;
* **socketio-auth**: *Authentication module for socket.io*;
* **sequelize**: *A promise-based ORM for Node.js and io.js. It supports the dialects PostgreSQL, MySQL, MariaDB, SQLite and MSSQL and features solid transaction support, relations, read replication and more.*;
* **scjs**: *Stanford Javascript Crypto Library*
* To use sequelize we must install the drivers for database, for this we use **sqlite3**, **pg** and **pg-hstore** libs;

### Graphics

* **MDL** (*Material Design Lite*)
* **Emoji** provided free by **[Emoji One][1]**


--------
### First things first

 - Install **Electron**, to do that just go to their [website][2] and download a [pre-build binary package][3]. Unzip it and we are ready to go.

```
wget https://github.com/atom/electron/releases/download/v0.36.8/electron-v0.36.8-linux-x64.zip
```

 - Install **Nodejs** using the following commands as [described in their website][4].

```
curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
sudo apt-get install -y nodejs
```

 - Nodejs comes with a **npm**, but as [described on their blog][5], make sure you update to the latest version using the code bellow:
     - *[After de line bellow, if you need follow this steps to correct the permissions of npm][6]*.

```
sudo npm install npm -g
```

 - Since we'll use **Postgresql** as our database just install it:

```
sudo apt-get install postgresql postgresql-contrib pgadmin3
```

>*If you choose to use **mongodb**, download the latest packege as [described here][7], unzip it, create the data folder using the command bellow, and run **mongod**.*
    - *In case you can't execute mongod, check if mongod is registred as a command, ou if you are inside the bin folder. You can put **mongod** and the next command **express** is some alias to make your life easier.*
**Sequelize doesn't support mongodb, in this case use mongoose!!**
```
wget https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-3.2.1.tgz
tar -zxvf mongodb-linux-x86_64-3.2.1.tgz
mkdir -p /data/db
mongod
```

 - The last step here is install **express-generator**, which will create a bootstrap project for us. To do that [follow their guide][8] or:

```
npm install express-generator -g
```

### The Project

Im calling this project **PARANOID**, for the single reason that this is a web chat which implements some cryptography to make the messages secure.
To start, lets create a folder. PARANOID has two parts, the client side and the server side, for blog porpuses im creating one folder with two projects inside:

```
mkdir paranoid
cd paranoid
mkdir client
mkdir server
```

 - paranoid
   - client
   - server

Go to the server folder and execute express command:

```
cd paranoid/server
express
```

This will create the structure dir for our nodejs project using express. Next give a install command to npm:

```
npm install node-gyp nw-gyp -g
npm install
```

It read the ***package.json*** file and install the dependecies listed inside. 

To start the server edit the **app.js** file and put a listen to the server:

```
app.listen(8080, '0.0.0.0', function () {
    console.log('Example app listening on localhost:8080!');
});
```

We are good to go, just type bellow in the shell and go in your browser to [http://localhost:8080][9]:

```
node app.js
```

You should see a message from express! \o/

----

To run **Electron** we must do the same as we did above, execute npm install inside de client folder. But before that, sqlite3 has some dependecies that need to be installed.

```
cd paranoid/client
npm install node-gyp nw-gyp -g
npm install
```
Please, do note that inside the package.json, the installation of sqlite3 and electron-rebuild are done in a postinstall script. This is to the fact that the sqlite been a C++ extension doesn't work well with Electron.
The lines executed with that script are the 

```
npm install sqlite3 --build-from-source --runtime=node-webkit --target_arch=ia64 --target=0.12.3 --no-bin-links

npm install electron-rebuild --no-bin-links
```

After that go ahead and just execute electron and you should see the interface.

```
electron .
```

If you do want to package the client side to use for yourself, please check this [page][10].


  [1]: http://emojione.com/
  [2]: http://electron.atom.io/
  [3]: https://github.com/atom/electron/releases
  [4]: https://nodejs.org/en/download/package-manager/
  [5]: http://blog.npmjs.org/post/85484771375/how-to-install-npm
  [6]: https://docs.npmjs.com/getting-started/fixing-npm-permissions
  [7]: https://docs.mongodb.org/manual/tutorial/install-mongodb-on-linux/
  [8]: http://expressjs.com/pt-br/starter/generator.html
  [9]: http://localhost:8080
  [10]: http://electron.atom.io/docs/v0.37.2/tutorial/application-packaging/
