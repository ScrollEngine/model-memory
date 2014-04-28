# Scroll Memory Model Layer ![Scroll Official Module](http://img.shields.io/badge/scroll-official-green.svg?style=flat)

***WARNING*** - This model layer is meant only for local testing. This **WILL** break production in any number of ways if used.

A Scroll Engine model layer that stores all data in a simple JavaScript object, IE in memory. It works great for local testing since you don't need any sort of database to connect to. This model layer also has **zero** contraits, so it is good for developing custom models for your scroll application as you can modify the data structure on the fly.

## Connect String

You can omit the `connection` configuration option, or you can provide an absolute path that will be searched for JSON files to load. This allows you to seed your data. The following files will be searched for and used to seed the corresponding data:

* *scroll.json*

If the option is ommited, an empty data set is used. Also note that only the root directory is searched.

http://www.json-generator.com/ is a great resource to generate JSON data, if you do end up wanting to seed your data.
