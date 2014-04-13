# Scroll Server Memory Store

***WARNING*** - This model layer is meant only for local testing. This **WILL** break production in any number of ways if used.

A Scroll Server model layer that stores all data in a simple JavaScript object, IE in memory. It works great for local testing since you don't need any sort of database to connect to.

You can omit the `connection` configuration option, or you can use it to pass a directory path that will be searched for JSON files to load. This allows you to seed your data. Only the root directory is searched and the following files are supported.

* *scrolls.json*

If the option is ommited, an empty data set is used.
