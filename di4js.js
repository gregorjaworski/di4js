(function (exports) {

  'use strict';

  exports = exports || {};

  if (typeof define === 'function' && define.amd) {
    define(function(){ return exports; });
  } else {
    window.di = exports; 
  }

  if (!('version' in exports)) {
    exports.version = '1.1.0';
  }

  var DependencyResolverException = function (message) {
    this.__name = 'DependencyResolverException';
    this.__stack = null;
    this.__message = message || "A dependency resolver exception has occurred.";
    var lines, i, tmp;
    if ((typeof navigator !== 'undefined' && navigator.userAgent.indexOf('Chrome') !== -1) ||
      (typeof navigator === 'undefined')) {
      lines = new Error().stack.split('\n');
      if (lines && lines.length > 2) {
        tmp = [];
        for (i = 2; i < lines.length; i++) {
          if (lines[i]) {
            tmp.push(lines[i].trim());
          }
        }
        this.stack = tmp.join('\n');
      }
    } else if (typeof navigator !== 'undefined' && navigator.userAgent.indexOf('Firefox') !== -1) {
      lines = new Error().stack.split('\n');
      if (lines && lines.length > 1) {
        tmp = [];
        for (i = 1; i < lines.length; i++) {
          if (lines[i]) {
            tmp.push('at ' + lines[i].trim().replace('@', ' (') + ')');
          }
        }
        this.stack = tmp.join('\n');
      }
    } else if (typeof navigator !== 'undefined' && navigator.userAgent.indexOf('Trident') !== -1) {
      try {
        throw new Error();
      } catch (error) {
        if ('stack' in error) {
          lines = error.stack.split('\n');
          if (lines && lines.length > 2) {
            tmp = [];
            for (i = 2; i < lines.length; i++) {
              if (lines[i]) {
                tmp.push(lines[i].trim());
              }
            }
            this.stack = tmp.join('\n');
          }
        } else {
          this.stack = '';
        }
      }
    } else {
      var error = new Error();
      if ('stack' in error) {
        this.stack = error.stack;
      } else {
        this.stack = '';
      }
    }
    Object.defineProperty(this, '__name', { enumerable: false });
    Object.defineProperty(this, '__message', { enumerable: false });
    Object.defineProperty(this, '__stack', { enumerable: false });
    Object.seal(this);
  };
  
  DependencyResolverException.prototype = Object.create(Object.prototype, {
  
    name: {
      get: function () {
        return this.__name;
      },
      set: function (value) {
        this.__name = value;
      },
      enumerable: true
    },
  
    message: {
      get: function () {
        return this.__message;
      },
      set: function (value) {
        this.__message = value;
      },
      enumerable: true
    },
  
    stack: {
      get: function () {
        return this.__stack;
      },
      set: function (value) {
        this.__stack = value;
      },
      enumerable: true
    },
  
    toString: {
      value: function () {
        var msg = this.name + ': ' + this.message;
        if (this.stack) {
          msg += '\n\t' + this.stack.replace(/\n/g, '\n\t');
        }
        return msg;
      },
      enumerable: true
    }
  
  });
  
  Object.seal(DependencyResolverException);
  Object.seal(DependencyResolverException.prototype);
  
  exports.DependencyResolverException = DependencyResolverException;

  var InstanceFactoryOptions = function (options) {
    this.__name = null;
    this.__type = null;
    this.__parameters = null;
    if (options) {
      for (var propertyName in options) {
        if (propertyName in this) {
          this[propertyName] = options[propertyName];
        } else {
          throw new DependencyResolverException("Class 'InstanceFactoryOptions' doesn't have a property '" +
            propertyName + "'");
        }
      }
    }
    Object.defineProperty(this, '__name', { enumerable: false });
    Object.defineProperty(this, '__type', { enumerable: false });
    Object.defineProperty(this, '__parameters', { enumerable: false });
    Object.seal(this);
  };
  
  InstanceFactoryOptions.prototype = Object.create(Object.prototype, {
  
    name: {
      get: function () {
        return this.__name;
      },
      set: function (value) {
        this.__name = value;
      },
      enumerable: true
    },
  
    type: {
      get: function () {
        return this.__type;
      },
      set: function (value) {
        this.__type = value;
      },
      enumerable: true
    },
  
    parameters: {
      get: function () {
        return this.__parameters;
      },
      set: function (value) {
        this.__parameters = value;
      },
      enumerable: true
    },
  
    toString: {
      value: function () {
        return '[object InstanceFactoryOptions]';
      },
      enumerable: true
    }
  
  });
  
  Object.seal(InstanceFactoryOptions);
  Object.seal(InstanceFactoryOptions.prototype);
  
  exports.InstanceFactoryOptions = InstanceFactoryOptions;

  var IInstanceFactory = Object.create(Object.prototype, {
  
    create: {
      value: function (options) {},
      enumerable: true
    },
  
    toString: {
      value: function () {
        return '[object IInstanceFactory]';
      },
      enumerable: true
    }
  
  });
  
  Object.freeze(IInstanceFactory);
  
  exports.IInstanceFactory = IInstanceFactory;

  var InstanceFactory = function () {
    Object.seal(this);
  };
  
  InstanceFactory.prototype = Object.create(Object.prototype, {
  
    create: {
      value: function (options) {
        if (!options) {
          throw new DependencyResolverException("Parameter 'options' is not set");
        }
        if ('type' in options && !options.type) {
          throw new DependencyResolverException("Factory can't create object, because type is not set");
        }
        if (typeof options.type !== 'function') {
          throw new DependencyResolverException("Factory can't create object, because given type is not a function");
        }
        if (options.type === Number || options.type === Date || options.type === Boolean || options.type === String ||
          options.type === Array || options.type === Function || options.type === RegExp) {
          throw new DependencyResolverException("Basic type can not be instantiated using a factory");
        }
        var instance = null;
        if (options.parameters && options.parameters.length > 0) {
          instance = Object.create(options.type.prototype);
          options.type.apply(instance, options.parameters);
        } else {
          instance = new options.type();
        }
        return instance;
      },
      enumerable: true
    },
  
    toString: {
      value: function () {
        return '[object InstanceFactory]';
      },
      enumerable: true
    }
  
  });
  
  Object.seal(InstanceFactory);
  Object.seal(InstanceFactory.prototype);
  
  exports.InstanceFactory = InstanceFactory;

  var INameTransformer = Object.create(Object.prototype, {
  
    transform: {
      value: function (name) {},
      enumerable: true
    },
  
    toString: {
      value: function () {
        return '[object INameTransformer]';
      },
      enumerable: true
    }
  
  });
  
  Object.freeze(INameTransformer);
  
  exports.INameTransformer = INameTransformer;

  var NameTransformer = function () {
    Object.seal(this);
  };
  
  NameTransformer.prototype = Object.create(Object.prototype, {
  
    transform: {
      value: function (name) {
        if (!name) {
          throw new DependencyResolverException("Parameter 'name' is not passed to the method 'transform'");
        }
        return name;
      },
      enumerable: true
    },
  
    toString: {
      value: function () {
        return '[object NameTransformer]';
      },
      enumerable: true
    }
  
  });
  
  Object.seal(NameTransformer);
  Object.seal(NameTransformer.prototype);
  
  exports.NameTransformer = NameTransformer;

  var IDependencyResolver = Object.create(Object.prototype, {
  
    isAutowired: {
      get: function () {},
      enumerable: true
    },
  
    autowired: {
      value: function (value) {},
      enumerable: true
    },
  
    register: {
      value: function (name) {},
      enumerable: true
    },
  
    as: {
      value: function (type) {},
      enumerable: true
    },
  
    instance: {
      value: function (instance) {},
      enumerable: true
    },
  
    asSingleton: {
      value: function () {},
      enumerable: true
    },
  
    withConstructor: {
      value: function () {},
      enumerable: true
    },
  
    param: {
      value: function (name) {},
      enumerable: true
    },
  
    withProperties: {
      value: function (name) {},
      enumerable: true
    },
  
    prop: {
      value: function (name) {},
      enumerable: true
    },
  
    val: {
      value: function (instance) {},
      enumerable: true
    },
  
    ref: {
      value: function (name) {},
      enumerable: true
    },
  
    setFactory: {
      value: function (factory) {},
      enumerable: true
    },
  
    create: {
      value: function () {},
      enumerable: true
    },
  
    inject: {
      value: function (func, name) {},
      enumerable: true
    },
  
    contains: {
      value: function (name) {},
      enumerable: true
    },
  
    resolve: {
      value: function (name) {},
      enumerable: true
    },
  
    getDefaultFactory: {
      value: function () {},
      enumerable: true
    },
  
    setDefaultFactory: {
      value: function (factory) {},
      enumerable: true
    },
  
    getNameTransformer: {
      value: function () {},
      enumerable: true
    },
  
    setNameTransformer: {
      value: function (transformer) {},
      enumerable: true
    },
  
    getRegistration: {
      value: function (name) {},
      enumerable: true
    },
  
    dispose: {
      value: function () {},
      enumerable: true
    },
  
    toString: {
      value: function () {
        return '[object IDependencyResolver]';
      },
      enumerable: true
    }
  
  });
  
  Object.freeze(IDependencyResolver);
  
  exports.IDependencyResolver = IDependencyResolver;

  var DependencyResolver = function (parent) {
    this.__parent = parent;
    this.__defaultFactory = null;
    this.__nameTransformer = null;
    this.__autowired = false;
    this.__container = null;
    this.__registration = null;
    this.__withProperties = false;
    this.__withConstructor = false;
    this.__parameter = null;
    this.__property = null;
    Object.defineProperty(this, '__parent', { enumerable: false });
    Object.defineProperty(this, '__defaultFactory', { enumerable: false });
    Object.defineProperty(this, '__nameTransformer', { enumerable: false });
    Object.defineProperty(this, '__autowired', { enumerable: false });
    Object.defineProperty(this, '__container', { enumerable: false });
    Object.defineProperty(this, '__registration', { enumerable: false });
    Object.defineProperty(this, '__withProperties', { enumerable: false });
    Object.defineProperty(this, '__withConstructor', { enumerable: false });
    Object.defineProperty(this, '__parameter', { enumerable: false });
    Object.defineProperty(this, '__property', { enumerable: false });
    Object.seal(this);
  };
  
  DependencyResolver.prototype = Object.create(Object.prototype, {
  
    isAutowired: {
      get: function () {
        return this.__autowired;
      },
      enumerable: true
    },
  
    autowired: {
      value: function (value) {
        if (value === undefined || value === null) {
          value = true;
        }
        if (typeof value !== 'boolean') {
          throw new DependencyResolverException("Parameter 'value' passed to the method 'autowired' has to " +
            "be a 'boolean'");
        }
        this.__autowired = value;
        return this;
      },
      enumerable: true
    },
  
    register: {
      value: function (name) {
        if (!name) {
          throw new DependencyResolverException("Parameter 'name' is not passed to the method 'register'");
        }
        if (typeof name !== 'string') {
          throw new DependencyResolverException("Parameter 'name' passed to the method 'register' has to be " +
            "a 'string'");
        }
        if (!this.__container) {
          this.__container = Object.create(null);
        }
        var registration;
        if (!(name in this.__container)) {
          this.__container[name] = {
            name: name,
            singleton: false,
            type: null,
            instance: null,
            factory: null,
            dependencies: null
          };
        }
        this.__registration = this.__container[name];
        this.__withConstructor = false;
        this.__withProperties = false;
        this.__parameter = null;
        this.__property = null;
        return this;
      },
      enumerable: true
    },
  
    as: {
      value: function (type) {
        if (!this.__registration) {
          throw new DependencyResolverException("Registration's name is not defined");
        }
        if (!type) {
          throw new DependencyResolverException("Parameter 'type' is not passed to the method 'as' for " +
            "registration '" + this.__registration.name + "'");
        }
        if (typeof type !== 'function') {
          throw new DependencyResolverException("Parameter 'type' passed to the method 'as' has to be a 'function' " +
            "for registration '" + this.__registration.name + "'");
        }
        this.__registration.instance = null;
        this.__registration.type = type;
        this.__registration.singleton = false;
        this.__registration.dependencies = {
          parameters: [],
          properties: []
        };
        this.__withConstructor = false;
        this.__withProperties = false;
        this.__parameter = null;
        this.__property = null;
        return this;
      },
      enumerable: true
    },
  
    instance: {
      value: function (instance) {
        if (!this.__registration) {
          throw new DependencyResolverException("Registration's name is not defined");
        }
        if (instance === null || instance === undefined) {
          throw new DependencyResolverException("Parameter 'instance' is not passed to the method 'instance' for " +
            "registration '" + this.__registration.name + "'");
        }
        this.__registration.instance = instance;
        this.__registration.type = null;
        this.__registration.factory = null;
        this.__registration.singleton = true;
        this.__registration.dependencies = null;
        this.__withConstructor = false;
        this.__withProperties = false;
        this.__parameter = null;
        this.__property = null;
        return this;
      },
      enumerable: true
    },
  
    asSingleton: {
      value: function () {
        if (!this.__registration) {
          throw new DependencyResolverException("Registration's name is not defined");
        }
        if (!this.__registration.type) {
          throw new DependencyResolverException("Type is not set for registration '" +
            this.__registration.name + "'");
        }
        this.__registration.singleton = true;
        this.__withConstructor = false;
        this.__withProperties = false;
        this.__parameter = null;
        this.__property = null;
        return this;
      },
      enumerable: true
    },
  
    withConstructor: {
      value: function () {
        if (!this.__registration) {
          throw new DependencyResolverException("Registration's name is not defined");
        }
        if (!this.__registration.type) {
          throw new DependencyResolverException("Type is not set for registration '" +
            this.__registration.name + "'");
        }
        this.__withConstructor = true;
        this.__withProperties = false;
        this.__parameter = null;
        this.__property = null;
        return this;
      },
      enumerable: true
    },
  
    param: {
      value: function (name) {
        if (!this.__registration) {
          throw new DependencyResolverException("Registration's name is not defined");
        }
        if (!this.__registration.type) {
          throw new DependencyResolverException("Type is not set for registration '" + this.__registration.name + "'");
        }
        if (!this.__withConstructor) {
          throw new DependencyResolverException("Invocation of method 'withConstructor' is missing for " +
            "registration '" + this.__registration.name + "'");
        }
        var parameters = this.__registration.dependencies.parameters,
            parameter = null,
            index;
        if (this.__autowired && (name === undefined || name === null)) {
          throw new DependencyResolverException("Parameter 'name' has to be passed to the method, when dependency " +
            "container has option 'autowired' enabled");
        }
        if (name !== null && name !== undefined) {
          if (typeof name === 'number') {
            index = name;
            name = undefined;
            if (index < 0) {
              throw new DependencyResolverException("Parameter 'name' passed to the method 'param' is out of " +
                "range for registration '" + this.__registration.name + "'");
            }
            if (index < parameters.length) {
              parameter = parameters[index];
            }
          } else if (typeof name === 'string') {
            for (var i = 0; i < parameters.length; i++) {
              if (parameters[i].name === name) {
                parameter = parameters[i];
                break;
              }
            }
          } else {
            throw new DependencyResolverException("Parameter 'name' passed to the method 'param' has to " +
              "be a 'number' or a 'string' for registration '" + this.__registration.name + "'");
          }
        }
        if (!parameter) {
          parameter = {
            index: index,
            name: name,
            value: undefined,
            reference: undefined
          };
          parameters.push(parameter);
        }
        this.__parameter = parameter;
        this.__property = null;
        return this;
      },
      enumerable: true
    },
  
    withProperties: {
      value: function () {
        if (!this.__registration) {
          throw new DependencyResolverException("Registration's name is not defined");
        }
        if (!this.__registration.type) {
          throw new DependencyResolverException("Type is not set for registration '" + this.__registration.name + "'");
        }
        this.__withProperties = true;
        this.__withConstructor = false;
        this.__parameter = null;
        this.__property = null;
        return this;
      },
      enumerable: true
    },
  
    prop: {
      value: function (name) {
        if (!this.__registration) {
          throw new DependencyResolverException("Registration's name is not defined");
        }
        if (!name) {
          throw new DependencyResolverException("Parameter 'name' is not passed to the method 'prop' for " +
            "registration '" + this.__registration.name + "'");
        }
        if (typeof name !== 'string') {
          throw new DependencyResolverException("Parameter 'name' passed to the method 'prop' has to be" +
            " a 'string' for registration '" + this.__registration.name + "'");
        }
        if (!this.__registration.type) {
          throw new DependencyResolverException("Type is not set for registration '" + this.__registration.name + "'");
        }
        if (!this.__withProperties) {
          throw new DependencyResolverException("Invocation of method 'withProperties' is missing for " +
            "registration '" + this.__registration.name + "'");
        }
        var properties = this.__registration.dependencies.properties,
            property = null;
        for (var i = 0; i < properties.length; i++) {
          if (properties[i].name === name) {
            property = properties[i];
          }
        }
        if (!property) {
          property = {
            name: name,
            value: undefined,
            reference: undefined
          };
          properties.push(property);
        }
        this.__parameter = null;
        this.__property = property;
        return this;
      },
      enumerable: true
    },
  
    val: {
      value: function (instance) {
        if (!this.__registration) {
          throw new DependencyResolverException("Registration's name is not defined");
        }
        if (instance === null || instance === undefined) {
          throw new DependencyResolverException("Parameter 'instance' is not passed to the method 'val'");
        }
        if (!this.__withProperties && !this.__withConstructor) {
          throw new DependencyResolverException("Invocation of method withConstructor' or 'withProperties' " +
            "is missing");
        }
        if (this.__withConstructor && !this.__parameter) {
          throw new DependencyResolverException("Parameter is not defined");
        }
        if (this.__withProperties && !this.__property) {
          throw new DependencyResolverException("Property is not defined");
        }
        if (this.__parameter) {
          this.__parameter.value = instance;
          this.__parameter.reference = undefined;
        } else if (this.__property) {
          this.__property.value = instance;
          this.__property.reference = undefined;
        }
        return this;
      },
      enumerable: true
    },
  
    ref: {
      value: function (name) {
        if (!this.__registration) {
          throw new DependencyResolverException("Registration's name is not defined");
        }
        if (!name) {
          throw new DependencyResolverException("Parameter 'name' is not passed to the method 'ref' for " +
            "registration '" + this.__registration.name + "'");
        }
        if (typeof name !== 'string') {
          throw new DependencyResolverException("Parameter 'name' passed to the method 'ref' has to " +
            "be a 'string' for registration '" + this.__registration.name + "'");
        }
        if (!this.__withProperties && !this.__withConstructor) {
          throw new DependencyResolverException("Invocation of method 'withConstructor' or 'withProperties' " +
            "is missing for registration '" + this.__registration.name + "'");
        }
        if (this.__withConstructor && !this.__parameter) {
          throw new DependencyResolverException("Parameter is not defined for registration '" +
            this.__registration.name + "'");
        }
        if (this.__withProperties && !this.__property) {
          throw new DependencyResolverException("Property is not defined for registration '" +
            this.__registration.name + "'");
        }
        if (!this.contains(name)) {
          throw new DependencyResolverException("Type or instance is not registered with name '" + name + "'");
        }
        if (this.__parameter) {
          this.__parameter.value = undefined;
          this.__parameter.reference = name;
        } else if (this.__property) {
          this.__property.value = undefined;
          this.__property.reference = name;
        }
        return this;
      },
      enumerable: true
    },
  
    setFactory: {
      value: function (factory) {
        if (!this.__registration) {
          throw new DependencyResolverException("Registration's name is not defined");
        }
        if (!factory) {
          throw new DependencyResolverException("Parameter 'factory' is not passed to the method 'setFactory");
        }
        if (typeof factory !== 'function' && typeof factory !== 'object') {
          throw new DependencyResolverException("Parameter 'factory' passed to the method 'setFactory' has to be " +
            "a 'function' or 'object'");
        }
        if (typeof factory === 'object' && !('create' in factory)) {
          throw new DependencyResolverException("Factory's instance passed to the method 'setFactory' has to have " +
            "a method 'create'");
        }
        if (!this.__registration.type) {
          throw new DependencyResolverException("Type is not set for registration '" + this.__registration.name);
        }
        this.__registration.factory = factory;
        this.__withConstructor = false;
        this.__withProperties = false;
        this.__parameter = null;
        this.__property = null;
        return this;
      },
      enumerable: true
    },
  
    create: {
      value: function () {
        return new DependencyResolver(this);
      },
      enumerable: true
    },
  
    inject: {
      value: function (func) {
        if (!func) {
          throw new DependencyResolverException("Parameter 'func' is not passed to method 'inject'");
        }
        var i,
            parameters = [],
            context = { resolving: [] };
        if (func instanceof Array) {
          if (func.length === 0) {
            throw new DependencyResolverException("The array passed to the method 'inject' can't be empty");
          }
          for (i = 0; i < func.length - 1; i++) {
            parameters.push(func[i]);
          }
          func = func[func.length - 1];
          if (typeof func !== 'function') {
            throw new DependencyResolverException("The last item of the array passed to the method 'inject' has " +
              "to be a 'function'");
          }
          for (i = 0; i < parameters.length; i++) {
            if (typeof parameters[i] === 'string' && this.contains(parameters[i])) {
              parameters[i] = this.__resolve(parameters[i], context);
            }
          }
          func.apply(null, parameters);
        } else {
          var registration = null;
          if (arguments.length === 2 && typeof arguments[1] === 'string') {
            var name = arguments[1];
            if (!this.contains(name)) {
              throw new DependencyResolverException("Type with name '" + name + "' is not registered");
            }
            registration = this.getRegistration(name);
          }
          var dependencyName;
          if (typeof func === 'function') {
            if (registration) {
              parameters = this.__getConstructorParameters(registration, context);
            } else {
              var args = this.__getFunctionArguments(func);
              for (i = 0; i < args.length; i++) {
                dependencyName = this.__resolveDependencyName(args[i]);
                if (this.contains(dependencyName)) {
                  parameters.push(this.__resolve(dependencyName, context));
                } else {
                  parameters.push(null);
                }
              }
            }
            func.apply(null, parameters);
          } else if (typeof func === 'object') {
            if (registration) {
              this.__setProperties(func, registration, context);
            } else {
              for (var propertyName in func) {
                dependencyName = this.__resolveDependencyName(propertyName);
                if (this.contains(dependencyName)) {
                  parameters.push({
                    name: propertyName,
                    value: this.__resolve(dependencyName, context)
                  });
                }
              }
              if (parameters.length > 0) {
                for (i = 0; i < parameters.length; i++) {
                  func[parameters[i].name] = parameters[i].value;
                }
              }
            }
          } else {
            throw new DependencyResolverException("Invalid parameter has been passed to the method 'inject'");
          }
        }
        return this;
      },
      enumerable: true
    },
  
    contains: {
      value: function (name) {
        if (!name) {
          throw new DependencyResolverException("Parameter 'name' is not passed to the method 'contains'");
        }
        if (typeof name !== 'string') {
          throw new DependencyResolverException("Parameter 'name' passed to the  has to be a 'string'");
        }
        var has = false;
        if (this.__container) {
          if (name in this.__container) {
            has = true;
          }
        }
        if (!has && this.__parent) {
          if (!('contains' in this.__parent)) {
            throw new DependencyResolverException("Dependency resolver's parent doesn't have a method 'contains'");
          }
          has = this.__parent.contains(name);
        }
        return has;
      },
      enumerable: true
    },
  
    resolve: {
      value: function (name) {
        return this.__resolve(name, { resolving: [] });
      },
      enumerable: true
    },
  
    getDefaultFactory: {
      value: function () {
        var factory = null;
        if (this.__defaultFactory) {
          factory = this.__defaultFactory;
        } else if (this.__parent) {
          if (!('getDefaultFactory' in this.__parent)) {
            throw new DependencyResolverException("Dependency resolver's parent doesn't have a " +
              "method 'getDefaultFactory'");
          }
          factory = this.__parent.getDefaultFactory();
        } else {
          factory = new InstanceFactory();
        }
        return factory;
      },
      enumerable: true
    },
  
    setDefaultFactory: {
      value: function (factory) {
        if (!factory) {
          throw new DependencyResolverException("Parameter 'factory' is not passed to the method " +
            "'setDefaultFactory");
        }
        if (typeof factory !== 'function' && typeof factory !== 'object') {
          throw new DependencyResolverException("Parameter 'factory' passed to the method 'setDefaultFactory' has " +
            " to be a 'function' or 'object'");
        }
        if (typeof factory === 'object' && !('create' in factory)) {
          throw new DependencyResolverException("Factory's instance passed to the method 'setDefaultFactory' has " +
            "to have a method 'create'");
        }
        this.__defaultFactory = factory;
        return this;
      },
      enumerable: true
    },
  
    getNameTransformer: {
      value: function () {
        var transformer = null;
        if (this.__nameTransformer) {
          transformer = this.__nameTransformer;
        } else if (this.__parent) {
          if (!('getNameTransformer' in this.__parent)) {
            throw new DependencyResolverException("Dependency resolver's parent doesn't have a " +
              "method 'getNameTransformer'");
          }
          transformer = this.__parent.getNameTransformer();
        } else {
          transformer = new NameTransformer();
        }
        return transformer;
      },
      enumerable: true
    },
  
    setNameTransformer: {
      value: function (transformer) {
        if (!transformer) {
          throw new DependencyResolverException("Parameter 'transformer' is not passed to the method " +
            "'setNameTransformer'");
        }
        if (typeof transformer !== 'function' && typeof transformer !== 'object') {
          throw new DependencyResolverException("Parameter 'transformer' passed to the method 'setNameTransformer' " +
            "has to be a 'function' or 'object'");
        }
        if (typeof transformer === 'object' && !('transform' in transformer)) {
          throw new DependencyResolverException("Trabsformers's instance passed to the method 'setNameTransformer' " +
            "has to have a method 'transform'");
        }
        this.__nameTransformer = transformer;
        return this;
      },
      enumerable: true
    },
  
    getRegistration: {
      value: function (name) {
        var registration = null;
        if (this.__container && name in this.__container) {
          registration = this.__container[name];
        } else if (this.__parent) {
          if (!('getRegistration' in this.__parent)) {
            throw new DependencyResolverException("Dependency resolver's parent doesn't have a " +
              "method 'getRegistration'");
          }
          registration = this.parent.getRegistration();
        }
        return registration;
      },
      enumerable: true
    },
  
    dispose: {
      value: function () {
        var registration = null;
        if (this.__container) {
          for (var name in this.__container) {
            registration = this.__container[name];
            if (registration.instance && ('dispose' in registration.instance)) {
              registration.instance.dispose();
            }
            registration.instance = null;
            registration.factory = null;
          }
        }
        this.__parent = null;
        this.__defaultFactory = null;
        this.__nameTransformer = null;
        this.__autowired = false;
        this.__container = null;
        this.__registration = null;
        this.__withProperties = false;
        this.__withConstructor = false;
        this.__parameter = null;
        this.__property = null;
      },
      enumerable: true
    },
  
    toString: {
      value: function () {
        return '[object DependencyResolver]';
      },
      enumerable: true
    },
  
    __getFunctionArguments: {
      value: function (func) {
        if (func && typeof func === 'function' && 'toString' in func) {
          var str = null;
          var result = func
            .toString()
            .match(/^[\s\(]*function[^(]*\(([^)]*)\)/);
          if (result && result.length > 1) {
            str = result[1]
              .replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
              .replace(/\s+/g, '');
          }
          if (str) {
            return str.split(',');
          }
        }
        return [];
      }
    },
  
    __resolve: {
      value: function (name, context) {
        if (!name) {
          throw new DependencyResolverException("Parameter 'name' is not passed to the method 'resolve'");
        }
        if (typeof name !== 'string') {
          throw new DependencyResolverException("Parameter 'name' passed to the method 'resolve' has to be " +
            "a 'string'");
        }
        if (!this.contains(name)) {
          throw new DependencyResolverException("Type or instance with name '" + name + "' is not registered");
        }
        var index = context.resolving.indexOf(name);
        if (index !== -1) {
          throw new DependencyResolverException("Can not resolve circular dependency '" + name + "'");
        }
        context.resolving.push(name);
        var i,
            instance = null,
            registration = this.getRegistration(name);
        if (registration.instance !== null && registration.instance !== undefined) {
          instance = registration.instance;
        } else {
          instance = this.__createInstance(registration, context);
          this.__setProperties(instance, registration, context);
          if (instance && registration.singleton) {
            registration.instance = instance;
          }
          if (!instance) {
            throw new DependencyResolverException("Failed to resolve instance by name '" + name + "'");
          }
        }
        index = context.resolving.indexOf(name);
        if (index > -1) {
          context.resolving.splice(index, 1);
        }
        return instance;
      }
    },
  
    __resolveDependencyName: {
      value: function (name) {
        var transform = this.getNameTransformer();
        if (typeof transform === 'function') {
          name = transform(name);
        } else {
          name = transform.transform(name);
        }
        if (!name) {
          throw new DependencyResolverException("Failed to resolve dependency name");
        }
        return name;
      }
    },
  
    __createInstance: {
      value: function (registration, context) {
        var i,
            instance;
        var parameters = this.__getConstructorParameters(registration, context);
        var options = new InstanceFactoryOptions({
          name: registration.name,
          type: registration.type,
          parameters: parameters
        });
        var factory = null;
        if (registration.factory) {
          factory = registration.factory;
        } else {
          factory = this.getDefaultFactory();
        }
        if (factory) {
          if (typeof factory === 'function') {
            instance = factory.call(null, options);
          } else {
            instance = factory.create(options);
          }
        } else {
          throw new DependencyResolverException("Default factory is not defined");
        }
        return instance;
      }
    },
  
    __getConstructorParameters: {
      value: function (registration, context) {
        var parameters = [];
        if (registration && registration.dependencies) {
          var i,
              parameter,
              value,
              args,
              index;
          if (this.__autowired) {
            args = this.__getFunctionArguments(registration.type);
            var dependencyName;
            for (i = 0; i < args.length; i++) {
              dependencyName = this.__resolveDependencyName(args[i]);
              if (this.contains(dependencyName)) {
                parameters.push(this.__resolve(dependencyName, context));
              } else {
                parameters.push(null);
              }
            }
          }
          for (i = 0; i < registration.dependencies.parameters.length; i++) {
            parameter = registration.dependencies.parameters[i];
            if (parameter.value !== undefined) {
              value = parameter.value;
            } else if (parameter.reference !== undefined) {
              value = this.__resolve(parameter.reference, context);
            } else {
              value = null;
            }
            if (parameter.index !== undefined && parameter.index !== null) {
              parameters[parameter.index] = value;
            } else if (parameter.name) {
              if (!args) {
                args = this.__getFunctionArguments(registration.type);
              }
              index = args.indexOf(parameter.name);
              if (index === -1) {
                throw new DependencyResolverException("Constructor in registration '" + registration.name +
                  "' doesn't have defined parameter '" + parameter.name + "'");
              }
              parameters[index] = value;
            } else {
              parameters.push(value);
            }
          }
        }
        return parameters;
      }
    },
  
    __hasProperty: {
      value: function (registration, name) {
        var has = false;
        if (registration.dependencies) {
          var property;
          for (var i = 0; i < registration.dependencies.properties.length; i++) {
            property = registration.dependencies.properties[i];
            if (property.name === name) {
              has = true;
              break;
            }
          }
        }
        return has;
      }
    },
  
    __setProperties: {
      value: function (instance, registration, context) {
        if (registration.dependencies) {
          if (this.__autowired) {
            for (var propertyName in instance) {
              var dependencyName = this.__resolveDependencyName(propertyName);
              if (!this.__hasProperty(propertyName) && this.contains(dependencyName)) {
                instance[propertyName] = this.__resolve(dependencyName, context);
              }
            }
          }
          for (var i = 0; i < registration.dependencies.properties.length; i++) {
            var property = registration.dependencies.properties[i];
            if (property.value !== undefined) {
              instance[property.name] = property.value;
            } else if (property.reference !== undefined) {
              instance[property.name] = this.__resolve(property.reference, context);
            }
          }
        }
      }
    }
  
  });
  
  Object.seal(DependencyResolver);
  Object.seal(DependencyResolver.prototype);
  
  exports.DependencyResolver = DependencyResolver;

  var __defaultDependencyResolver = null;
  
  Object.defineProperty(exports, 'getDefaultDependencyResolver', {
    value: function () {
      if (!__defaultDependencyResolver) {
        __defaultDependencyResolver = new DependencyResolver();
      }
      return __defaultDependencyResolver;
    },
    enumerable: true
  });
  
  Object.defineProperty(exports, 'setDefaultDependencyResolver', {
    value: function (value) {
      __defaultDependencyResolver = value;
    },
    enumerable: true
  });
  
  Object.defineProperty(exports, 'isAutowired', {
    get: function () {
      return exports
        .getDefaultDependencyResolver()
        .isAutowired;
    },
    enumerable: true
  });
  
  Object.defineProperty(exports, 'autowired', {
    value: function (value) {
      return exports
        .getDefaultDependencyResolver()
        .autowired(value);
    },
    enumerable: true
  });
  
  Object.defineProperty(exports, 'register', {
    value: function (name) {
      return exports
        .getDefaultDependencyResolver()
        .register(name);
    },
    enumerable: true
  });
  
  Object.defineProperty(exports, 'as', {
    value: function (type) {
      return exports
        .getDefaultDependencyResolver()
        .as(type);
    },
    enumerable: true
  });
  
  Object.defineProperty(exports, 'instance', {
    value: function (instance) {
      return exports
        .getDefaultDependencyResolver()
        .instance(instance);
    },
    enumerable: true
  });
  
  Object.defineProperty(exports, 'asSingleton', {
    value: function () {
      return exports
        .getDefaultDependencyResolver()
        .asSingleton();
    },
    enumerable: true
  });
  
  Object.defineProperty(exports, 'withConstructor', {
    value: function () {
      return exports
        .getDefaultDependencyResolver()
        .withConstructor();
    },
    enumerable: true
  });
  
  Object.defineProperty(exports, 'param', {
    value: function (name) {
      return exports
        .getDefaultDependencyResolver()
        .param(name);
    },
    enumerable: true
  });
  
  Object.defineProperty(exports, 'withProperties', {
    value: function () {
      return exports
        .getDefaultDependencyResolver()
        .withProperties();
    },
    enumerable: true
  });
  
  Object.defineProperty(exports, 'prop', {
    value: function (name) {
      return exports
        .getDefaultDependencyResolver()
        .prop(name);
    }
  });
  
  Object.defineProperty(exports, 'val', {
    value: function (instance) {
      return exports
        .getDefaultDependencyResolver()
        .val(instance);
    },
    enumerable: true
  });
  
  Object.defineProperty(exports, 'ref', {
    value: function (name) {
      return exports
        .getDefaultDependencyResolver()
        .ref(name);
    },
    enumerable: true
  });
  
  Object.defineProperty(exports, 'setFactory', {
    value: function (factory) {
      return exports
        .getDefaultDependencyResolver()
        .setFactory(factory);
    },
    enumerable: true
  });
  
  Object.defineProperty(exports, 'create', {
    value: function () {
      return exports
        .getDefaultDependencyResolver()
        .create();
    },
    enumerable: true
  });
  
  Object.defineProperty(exports, 'inject', {
    value: function (func, name) {
      return exports
        .getDefaultDependencyResolver()
        .inject(func, name);
    },
    enumerable: true
  });
  
  Object.defineProperty(exports, 'contains', {
    value: function (name) {
      return exports
        .getDefaultDependencyResolver()
        .contains(name);
    },
    enumerable: true
  });
  
  Object.defineProperty(exports, 'resolve', {
    value: function (name) {
      return exports
        .getDefaultDependencyResolver()
        .resolve(name);
    },
    enumerable: true
  });
  
  Object.defineProperty(exports, 'getDefaultFactory', {
    value: function () {
      return exports
        .getDefaultDependencyResolver()
        .getDefaultFactory();
    },
    enumerable: true
  });
  
  Object.defineProperty(exports, 'setDefaultFactory', {
    value: function (factory) {
      return exports
        .getDefaultDependencyResolver()
        .setDefaultFactory(factory);
    },
    enumerable: true
  });
  
  Object.defineProperty(exports, 'getNameTransformer', {
    value: function () {
      return exports
        .getDefaultDependencyResolver()
        .getNameTransformer();
    },
    enumerable: true
  });
  
  Object.defineProperty(exports, 'setNameTransformer', {
    value: function (transformer) {
      return exports
        .getDefaultDependencyResolver()
        .setNameTransformer(transformer);
    },
    enumerable: true
  });
  
  Object.defineProperty(exports, 'getRegistration', {
    value: function (name) {
      return exports
        .getDefaultDependencyResolver()
        .getRegistration(name);
    },
    enumerable: true
  });
  
  Object.defineProperty(exports, 'dispose', {
    value: function () {
      return exports
        .getDefaultDependencyResolver()
        .dispose();
    },
    enumerable: true
  });

} (window.di));