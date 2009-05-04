/*
* JsFormCheck is a Javascript Class for generic Form Validation
* It gets it validation rules out of a basic JSON Object
* This JSON Object can as well be used as a Ruleset for Serverside Validation
* A PHP Version already exists (thanks to Mike Davies)
* 
* http://blog.ginader.de/dev/JsCheckForm/index.php
*
* Copyright (c) 2008
* Dirk Ginader (ginader.de)
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
*
* Version: 1.0
*/

JsFormCheck = function(config){
  this.debug = false;
  this.config = config;
  this.targetFormObj = null;
  this.errors = [];
  this.validators = {};
  this.renderers = {};
  this.renderer = '';
  this.init();
};
JsFormCheck.prototype = {
  init : function(){
    this.targetFormObj = document.getElementById(this.config.targetFormId);
    if(!this.targetFormObj){
      return;
    }
    this.addDefaultValidators();
    this.addDefaultErrorRenderers();
    this.setErrorRenderer('above');
    this.addEvents();
  },
  addValidator : function(name,func){
    this.validators[name] = func;
  },
  addDefaultValidators : function(){
    this.addValidator('isEmail',function(el){
      var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      return filter.test(el.value);
    });
    this.addValidator('isText',function(el){
      var filter  = /^[a-zA-Z\ ]+$/;
      return filter.test(el.value);
    });
    this.addValidator('isNumber',function(el){
      var filter  = /^\d+$/; 
      return filter.test(el.value);
    });
    this.addValidator('isIpAdress',function(el){
      var filter  = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
      return filter.test(el.value);
    });
  },
  addErrorRenderer : function(name,func){
    this.renderers[name] = func;
  },
  setErrorRenderer : function(renderer){
    this.renderer = renderer;
  },
  addDefaultErrorRenderers : function(){
    this.addErrorRenderer('label',{
      render : function(that){
        that.highlightErrors();
        for(var i = that.errors.length-1;i>=0;i--){
          var e = that.errors[i];
          var el = e.el;
          if(e.el.length && e.el[0].type == 'radio'){
            el = e.el[0];
          }
          var label = that.getLabelOfObj(el);
          if(!label){
            that.warn('Element: "'+el.name+'" has no Label!');
            return;
          }
          var error = document.createElement("span");
          error.className = "error";
          var errormsg = document.createTextNode(e.msg+' ');
          error.appendChild(errormsg);
          label.insertBefore(error,label.childNodes[0]);
          label.focus();
        }
      },
      unrender : function(that){
        that.unhighlightErrors();
        for(var i = that.errors.length-1;i>=0;i--){
          var e = that.errors[i];
          var el = e.el;
          if(e.el.length && e.el[0].type == 'radio'){
            el = e.el[0];
          }
          var label = that.getLabelOfObj(el);
          if(!label){
            return;
          }
          var error = label.childNodes[0];
          label.removeChild(error);
          error = null;
        }
      }
    });
    this.addErrorRenderer('above',{
      render : function(that){
        that.highlightErrors();
        that.errorContainer = document.createElement("div");
        that.errorContainer.className = "errors";
        var head = document.createElement("h3");
        var headtext = document.createTextNode("Errors");
        head.appendChild(headtext);
        that.errorContainer.appendChild(head);
        var ul = that.getErrorsAsList();
        that.errorContainer.appendChild(ul);
        that.targetFormObj.parentNode.insertBefore(that.errorContainer,that.targetFormObj);
        that.errorContainer.getElementsByTagName('a')[0].focus();
      },
      unrender : function(that){
        that.unhighlightErrors();
        if(that.errorContainer){
          that.errorContainer.parentNode.removeChild(that.errorContainer);
          that.errorContainer = null;
        }
      }
    });
    this.addErrorRenderer('below',{
      render : function(that){
        that.errorContainer = document.createElement("div");
        that.errorContainer.className = "errors";
        var head = document.createElement("h4");
        var headtext = document.createTextNode("Errors");
        head.appendChild(headtext);
        that.errorContainer.appendChild(head);
        var ul = that.getErrorsAsList();
        that.errorContainer.appendChild(ul);
        that.targetFormObj.parentNode.insertBefore(that.errorContainer,that.targetFormObj.nextSibling); // only difference to "above"
        that.errorContainer.getElementsByTagName('a')[0].focus();
      },
      unrender : function(that){
        if(that.errorContainer){
          that.errorContainer.parentNode.removeChild(that.errorContainer);
          that.errorContainer = null;
        }
      }
    });
  },
  getErrorsAsList : function(){
    var ul = document.createElement("ul");
    for(var i=0, l=this.errors.length; i<l; i++){
      var e = this.errors[i];
      var li = document.createElement("li");
      var t = document.createTextNode(e.msg);
      var a = document.createElement("a");
      a.href = '#'+e.el.id;
      a.onclick = function(){
        var targetId = this.href.split('#')[1];
        var t = document.getElementById(targetId);
        if(t.length && (t[0].type == 'radio')){
          t = t[0];
        }
        t.focus();
        return false;
      };
      a.appendChild(t);
      li.appendChild(a);
      ul.appendChild(li);
    }
    return ul;
  },
  highlightErrors : function(){
    for(var i=0, l=this.errors.length; i<l; i++){
      var e = this.errors[i];
      var label = null;
      if(e.el.length){
        if(e.el[0].type == "radio"){
          for(var j=0,le=e.el.length;j<le;j++){
            this.addClassName(e.el[j],'error');
            label = this.getLabelOfObj(e.el[j]);
            this.addClassName(label,'error');
          }
        }else if(e.el.options){
          this.addClassName(e.el[0].parentNode,'error');
          label = this.getLabelOfObj(e.el[0].parentNode);
          this.addClassName(label,'error');
        }
      }else{
        this.addClassName(e.el,'error');
        label = this.getLabelOfObj(e.el);
        this.addClassName(label,'error');
      }
    }
  },
  unhighlightErrors : function(){
    for(var i=0, l=this.errors.length; i<l; i++){
      var e = this.errors[i];
      var label = null;
      if(e.el.length){
        if(e.el[0].type == "radio"){
          for(var j=0,le=e.el.length;i<le;j++){
            this.removeClassName(e.el[j],'error');
            label = this.getLabelOfObj(e.el[j]);
            this.removeClassName(label,'error');
          }
        }else if(e.el.options){
          this.removeClassName(e.el[0].parentNode,'error');
          label = this.getLabelOfObj(e.el[0].parentNode);
          this.removeClassName(label,'error');
        }
      }else{
        this.removeClassName(e.el,'error');
        label = this.getLabelOfObj(e.el);
        this.removeClassName(label,'error');
      }
    }
  },
  addEvents : function(){
    var that = this;
    this.targetFormObj.onsubmit = function(){
      if(that.config.debug){
        if(that.checkRules()){
          that.log('Form would now have been sent if not in Debug Mode!');
        }
        return false;
      }else{
        return that.checkRules();
      }
    };
  },
  checkRules : function(){
    this.unrenderErrors(); // evtl. existierende Fehlerliste entfernen
    this.errors = []; // neuer leerer Fehler Array
    if(!this.config.rules){
      return true; // no rules == no Form checking needed
    }
    for( var i=0, l=this.config.rules.length; i<l; i++ ){
      this.validate(this.config.rules[i]); // alle Regeln nacheinander prüfen
    }
    if(this.errors.length !== 0){
      this.renderErrors(); // Fehler vorhanden -> anzeigen
      return false; // verhindert das absenden des Forms
    }else{
      return true; // erlaubt das absenden
    }
  },
  validate : function(rule){
    var el = this.targetFormObj[rule.name];
    if(!el){
      this.warn('validate: element: "'+rule.name+'" not found!');
      return; // element not found - fail silently
    }
    if(el.length){
      if(el[0].type == "radio" && rule.required){
        for(var i=0,l=el.length;i<l;i++){
          if(el[i].checked){
            return;
          }
        }
        this.addError(el,rule.requiredMsg); // Error - selection required
        return;
      }else if(el.options && rule.required){
        if(el.options[el.selectedIndex].value === ''){
          this.addError(el,rule.requiredMsg); // Error - selection required
          return;
        }
      }
    }
    if(el.type == "text"){
      if(!rule.required && !el.value){ 
        return; // do not validate when Input is empty and not required
      }
      if(rule.required && !el.value){ // Error - Input is required but empty
        this.addError(el,rule.requiredMsg);
        return;
      }
    }else if(el.type == "checkbox" && rule.required){
      if(!el.checked){
        this.addError(el,rule.requiredMsg); // Error - selection required
      }
      return el.checked; // required checkbox is checked
    }
    if(!rule.validate){ // no validation needed
      return;
    }
    if(!this.validators[rule.validate]){ // Exception: unknown validation rule
      this.warn('validate: unknown validation rule: "'+rule.validate+'" is used on Element: "'+rule.name+'"!');
      return;
    }
    if(!this.validators[rule.validate](el)){ // Error - does not validate
      this.addError(el,rule.validatedMsg);
    }
  },
  addError : function(el,msg){
    this.errors[this.errors.length] = {el:el,msg:msg};
  },
  renderErrors : function(){
    if(!this.renderers[this.renderer]){
      this.warn('renderErrors: No Renderer called "'+this.renderer+'" available!');
      return;
    }
    this.renderers[this.renderer].render(this);
  },
  unrenderErrors : function(){
    if(!this.renderers[this.renderer]){
      this.warn('unrenderErrors: No Renderer called "'+this.renderer+'" available!');
      return;
    }
    this.renderers[this.renderer].unrender(this);
  },
  // Tools
  getLabelOfObj : function(el){
    var id = el.id;
    if(!id){
      this.warn('getLabelOfObj: The Element: "'+el.name+'" has no id property!');
      return null;
    }
    var labels = document.getElementsByTagName("label");
    if(!labels){
      this.warn('getLabelOfObj: No Labels found in the current Document!');
      return null;
    }
    for(var i=0,l=labels.length;i<l;i++){
      if(labels[i].htmlFor && labels[i].htmlFor == id){
        return labels[i];
      }
    }
    this.warn('getLabelOfObj: No Labels found for the Element: "'+id+'"');
    return null;
  },
  getClassNames : function(el){
    if(el && el.className){
      return el.className.split(" ");
    }
    return [];
  },
  addClassName : function(el,className){
    var classNames = this.getClassNames(el);
    classNames[classNames.length] = className;
    if(el){
      el.className = classNames.join(" ");
    }else{
      this.warn('addClassName: failed for: '+el);
    }
  },
  removeClassName : function(el,className){
    var classNames = this.getClassNames(el);
    for(var i=0,l=classNames.length;i<l;i++){
      if(classNames[i] == className){
        classNames[i] = "";
      }
    }
    if(el && el.className){
      el.className = classNames.join(" ");
    }
  },
  log : function(msg){
    if(this.config.debug && window.console && window.console.log){
      window.console.log(msg);
    }
  },
  warn : function(msg){
    if(this.config.debug && window.console && window.console.warn){
      window.console.warn(msg);
    }
  }
};