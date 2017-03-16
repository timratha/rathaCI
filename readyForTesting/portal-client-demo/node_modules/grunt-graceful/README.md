# grunt-graceful

> Gracefully fail a grunt task

## Getting Started
This plugin requires Grunt `~0.4.4`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-graceful --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-graceful');
```

## The "graceful" task

### Overview
This plugin is very simple. It has no configuration. It just registers a task named graceful which accepts the name of a
task as a parameter. It executes this task in a try catch, and logs any errors without stopping grunt execution.

An optional second parameter contains a message to log in the event of failure or an instruction to suppress logging.


### Usage Examples

```js
//run foo task, fail on error and log standard message
grunt.task.run('graceful:foo');

//run foo task, fail on error and log custom message
grunt.task.run('graceful:foo:no flies on you');

//run foo task, fail on error, no log
grunt.task.run('graceful:foo:false');
```


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
1.0.0 - initial release
