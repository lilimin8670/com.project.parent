
var DHTMLSuite = {};
var DHTMLSuite_funcs={};

var standardObjectsCreated = false;	
DHTMLSuite.eventEls=[];

// Creating a trim method
if(!String.trim)String.prototype.trim=function(){ return this.replace(/^\s+|\s+$/, ''); };
var DHTMLSuite_funcs={};
if(!window.DHTML_SUITE_THEME)var DHTML_SUITE_THEME='blue';
if(!window.DHTML_SUITE_THEME_FOLDER)var DHTML_SUITE_THEME_FOLDER='../themes/';
if(!window.DHTML_SUITE_JS_FOLDER)var DHTML_SUITE_JS_FOLDER='../js/separateFiles/';

/* Simple AJAX Code-Kit (SACK) v1.6.1 */
/* 2005 Gregory Wild-Smith */
/* www.twilightuniverse.com */
/* Software licenced under a modified X11 licence,
   see documentation or authors website for more details */

function sack(file) {
	this.xmlhttp = null;

	this.resetData = function() {
		this.method = "POST";
  		this.queryStringSeparator = "?";
		this.argumentSeparator = "&";
		this.URLString = "";
		this.encodeURIString = true;
  		this.execute = false;
  		this.element = null;
		this.elementObj = null;
		this.requestFile = file;
		this.vars = {};
		this.responseStatus = new Array(2);
  	};

	this.resetFunctions = function() {
  		this.onLoading = function() { };
  		this.onLoaded = function() { };
  		this.onInteractive = function() { };
  		this.onCompletion = function() { };
  		this.onError = function() { };
		this.onFail = function() { };
	};

	this.reset = function() {
		this.resetFunctions();
		this.resetData();
	};

	this.createAJAX = function() {
		try {
			this.xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e1) {
			try {
				this.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e2) {
				this.xmlhttp = null;
			}
		}

		if (! this.xmlhttp) {
			if (typeof XMLHttpRequest != "undefined") {
				this.xmlhttp = new XMLHttpRequest();
			} else {
				this.failed = true;
			}
		}
	};

	this.setVar = function(name, value){
		this.vars[name] = Array(value, false);
	};

	this.encVar = function(name, value, returnvars) {
		if (true == returnvars) {
			return Array(encodeURIComponent(name), encodeURIComponent(value));
		} else {
			this.vars[encodeURIComponent(name)] = Array(encodeURIComponent(value), true);
		}
	};

	this.processURLString = function(string, encode) {
		encoded = encodeURIComponent(this.argumentSeparator);
		regexp = new RegExp(this.argumentSeparator + "|" + encoded);
		varArray = string.split(regexp);
		for (i = 0; i < varArray.length; i++){
			urlVars = varArray[i].split("=");
			if (true == encode){
				this.encVar(urlVars[0], urlVars[1]);
			} else {
				this.setVar(urlVars[0], urlVars[1]);
			}
		}
	};

	this.createURLString = function(urlstring) {
		if (this.encodeURIString && this.URLString.length) {
			this.processURLString(this.URLString, true);
		}

		if (urlstring) {
			if (this.URLString.length) {
				this.URLString += this.argumentSeparator + urlstring;
			} else {
				this.URLString = urlstring;
			}
		}

		// prevents caching of URLString
		this.setVar("rndval", new Date().getTime());

		urlstringtemp = [];
		for (key in this.vars) {
			if (false == this.vars[key][1] && true == this.encodeURIString) {
				encoded = this.encVar(key, this.vars[key][0], true);
				delete this.vars[key];
				this.vars[encoded[0]] = Array(encoded[1], true);
				key = encoded[0];
			}

			urlstringtemp[urlstringtemp.length] = key + "=" + this.vars[key][0];
		}
		if (urlstring){
			this.URLString += this.argumentSeparator + urlstringtemp.join(this.argumentSeparator);
		} else {
			this.URLString += urlstringtemp.join(this.argumentSeparator);
		}
	};

	this.runResponse = function() {
		eval(this.response);
	};

	this.runAJAX = function(urlstring) {
		if (this.failed) {
			this.onFail();
		} else {
			this.createURLString(urlstring);
			if (this.element) {
				this.elementObj = document.getElementById(this.element);
			}
			if (this.xmlhttp) {
				var self = this;
				if (this.method == "GET") {
					totalurlstring = this.requestFile + this.queryStringSeparator + this.URLString;
					this.xmlhttp.open(this.method, totalurlstring, true);
				} else {
					this.xmlhttp.open(this.method, this.requestFile, true);
					try {
						this.xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
					} catch (e) { }
				}

				this.xmlhttp.onreadystatechange = function() {
					switch (self.xmlhttp.readyState) {
						case 1:
							self.onLoading();
							break;
						case 2:
							self.onLoaded();
							break;
						case 3:
							self.onInteractive();
							break;
						case 4:
							self.response = self.xmlhttp.responseText;
							self.responseXML = self.xmlhttp.responseXML;
							self.responseStatus[0] = self.xmlhttp.status;
							self.responseStatus[1] = self.xmlhttp.statusText;
							if (self.execute) {
								self.runResponse();
							}

							if (self.elementObj) {
								elemNodeName = self.elementObj.nodeName;
								elemNodeName = elemNodeName.toLowerCase();
								if (elemNodeName == "input"
								|| elemNodeName == "select"
								|| elemNodeName == "option"
								|| elemNodeName == "textarea") {
									self.elementObj.value = self.response;
								} else {
									self.elementObj.innerHTML = self.response;
								}
							}
							if (self.responseStatus[0] == "200") {
								self.onCompletion();
							} else {
								self.onError();
							}
							/* These lines were added by Alf Magne Kalleland ref. info on the sack home page. It prevents memory leakage in IE */
							self.URLString = "";
							delete self.xmlhttp['onreadystatechange'];
							self.xmlhttp=null;
							self.responseStatus=null;
							self.response=null;
							self.responseXML=null;
							
							break;
					}
				};
				this.xmlhttp.send(this.URLString);
			}
		}
	};

	this.runAJAXSync = function(urlstring) {
		if (this.failed) {
			this.onFail();
		} else {
			this.createURLString(urlstring);
			if (this.element) {
				this.elementObj = document.getElementById(this.element);
			}
			if (this.xmlhttp) {
				var self = this;
				if (this.method == "GET") {
					var totalurlstring = this.requestFile + this.queryStringSeparator + this.URLString;
					this.xmlhttp.open(this.method, totalurlstring, false);
				} else {
					this.xmlhttp.open(this.method, this.requestFile, false);
					try {
						this.xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
					} catch (e) { }
				}
				this.xmlhttp.send(this.URLString);
				if (this.xmlhttp.status==200 && this.xmlhttp.readyState==4)	{
					this.response = this.xmlhttp.responseText;
					this.onCompletion();
					/*  It prevents memory leakage in IE */
					this.URLString = "";
					delete this.xmlhttp['onreadystatechange'];
					this.responseStatus=null;
					this.responseXML=null;
					this.xmlhttp=null;
					return this.response;
				}
			}
		}
	};

	this.reset();
	this.createAJAX();
}

/************************************************************************************************************
*	Ajax dynamic content script
*
*	Created:			August, 23rd, 2006
*
*
* 	Update log:
*
************************************************************************************************************/

/**
* @constructor
* @class The purpose of this class is to load content of external files into HTML elements on your page(<a href="../../demos/demo-dynamic-content-1.html" target="_blank">demo</a>).
* @version		1.0
* @version 1.0
*
* @author	Alf Magne Kalleland(www.dhtmlgoodies.com)
**/

DHTMLSuite.ajaxUtil=function(){
	var ajaxObjects;
	this.ajaxObjects=[];

	try{
		if(!standardObjectsCreated)
			DHTMLSuite.createStandardObjects();	
// This line starts all the init methods
	}catch(e){
		alert(e.name + ": " + e.message); 
		alert('You need to include the dhtmlSuite-common.js file');
	}
	var objectIndex;
	this.objectIndex=DHTMLSuite.variableStorage.arrayDSObjects.length;
	DHTMLSuite.variableStorage.arrayDSObjects[this.objectIndex]=this;

};

DHTMLSuite.ajaxUtil.prototype={
	
// {{{ sendRequest()
	/**
	*Sends an ajax request to the server
	 *
	*@param String url=Path on the server
	*@param String paramString-Parameters,  Example: "varA=2&varB=3";
	*@param String functionNameOnComplete=Function to execute on complete, example: "myFunction". The ajax object will be sent to this function and you can get the response from the "reponse" attribute.
	 *			NB! This ajax object will be cleared automatically by the script after a 3 second delay.
	 *
	*@public
	 */
	sendRequest:function(url,paramString,functionNameOnComplete){
		var ind=this.objectIndex;
		var ajaxIndex=this.ajaxObjects.length;
		try{
			this.ajaxObjects[ajaxIndex]=new sack();
		}catch(e){
			alert('Could not create ajax object. Please make sure that ajax.js is included');
		}
		if(paramString){
			var params=this.__getArrayByParamString(paramString);
			for(var no=0;no<params.length;no++){
			this.ajaxObjects[ajaxIndex].setVar(params[no].key,params[no].value);
			}
		}
		this.ajaxObjects[ajaxIndex].requestFile=url;	
	// Specifying which file to get
		this.ajaxObjects[ajaxIndex].onCompletion=function(){ DHTMLSuite.variableStorage.arrayDSObjects[ind].__onComplete(ajaxIndex,functionNameOnComplete); };	
	// Specify function that will be executed after file has been found
		this.ajaxObjects[ajaxIndex].onError=function(){ DHTMLSuite.variableStorage.arrayDSObjects[ind].__onError(ajaxIndex,url); };	
	// Specify function that will be executed after file has been found
		this.ajaxObjects[ajaxIndex].runAJAX();	
	// Execute AJAX function
	}
	
// }}}
	,

	sendPortletRequest:function(url,paramString,divId){
		var ind=this.objectIndex;
		var ajaxIndex=this.ajaxObjects.length;
		try{
			this.ajaxObjects[ajaxIndex]=new sack();
		}catch(e){
			alert('Could not create ajax object. Please make sure that ajax.js is included');
		}
		if(paramString){
			var params=this.__getArrayByParamString(paramString);
			for(var no=0;no<params.length;no++){
			this.ajaxObjects[ajaxIndex].setVar(params[no].key,params[no].value);
			}
		}
		this.ajaxObjects[ajaxIndex].requestFile=url;	
	// Specifying which file to get
		this.ajaxObjects[ajaxIndex].onCompletion=function(){ DHTMLSuite.variableStorage.arrayDSObjects[ind].__onPortletComplete(ajaxIndex,divId); };	
	// Specify function that will be executed after file has been found
		this.ajaxObjects[ajaxIndex].onError=function(){ DHTMLSuite.variableStorage.arrayDSObjects[ind].__onError(ajaxIndex,url); };	
	// Specify function that will be executed after file has been found
		this.ajaxObjects[ajaxIndex].runAJAX();	
	// Execute AJAX function
	},


	sendRequestSync:function(url,paramString,functionNameOnComplete){
		var ind=this.objectIndex;
		var ajaxIndex=this.ajaxObjects.length;
		try{
			this.ajaxObjects[ajaxIndex]=new sack();
		}catch(e){
			alert('Could not create ajax object. Please make sure that ajax.js is included');
		}
		if(paramString){
			var params=this.__getArrayByParamString(paramString);
			for(var no=0;no<params.length;no++){
			this.ajaxObjects[ajaxIndex].setVar(params[no].key,params[no].value);
			}
		}
		this.ajaxObjects[ajaxIndex].requestFile=url;	
	// Specifying which file to get
		this.ajaxObjects[ajaxIndex].onCompletion=function(){ DHTMLSuite.variableStorage.arrayDSObjects[ind].__onComplete(ajaxIndex,functionNameOnComplete); };	
	// Specify function that will be executed after file has been found
		this.ajaxObjects[ajaxIndex].onError=function(){ DHTMLSuite.variableStorage.arrayDSObjects[ind].__onError(ajaxIndex,url); };	
	// Specify function that will be executed after file has been found
		return this.ajaxObjects[ajaxIndex].runAJAXSync();	
	// Execute AJAX function
	},

	sendTagRequest:function(url,tag,functionNameOnComplete){
		var ind=this.objectIndex;
		var ajaxIndex=this.ajaxObjects.length;
		try{
			this.ajaxObjects[ajaxIndex]=new sack();
		}catch(e){
			alert('Could not create ajax object. Please make sure that ajax.js is included');
		}
		if(tag){
			var params=this.__getArrayByTag(tag);
			for(var no=0;no<params.length;no++){
				this.ajaxObjects[ajaxIndex].setVar(params[no].key,params[no].value);
			}
		}
		this.ajaxObjects[ajaxIndex].requestFile=url;	
	// Specifying which file to get
		this.ajaxObjects[ajaxIndex].onCompletion = function(){ DHTMLSuite.variableStorage.arrayDSObjects[ind].__onComplete(ajaxIndex,functionNameOnComplete); };	
	// Specify function that will be executed after file has been found
		this.ajaxObjects[ajaxIndex].onError=function(){ DHTMLSuite.variableStorage.arrayDSObjects[ind].__onError(ajaxIndex,url); };	
	// Specify function that will be executed after file has been found
		this.ajaxObjects[ajaxIndex].runAJAX();	
	// Execute AJAX function
	},
	
// {{{ __getArrayByParamString()
	/**
	*Sends an ajax request to the server
	 *
	*@param String paramString-Parameters,  Example: "varA=2&varB=3";
	*@return Array of key+value
	 *
	*@private
	 */
	__getArrayByParamString:function(paramString){
	var retArray=[];
	var items=paramString.split(/&/g);
	for(var no=0;no<items.length;no++){
		var tokens=items[no].split(/=/);
		var index=retArray.length;
		retArray[index]={ key:tokens[0],value:tokens[1] }
	}
	return retArray;
	}
	
// }}}
	,
	
	// 取某个标签下的所有值
	__getArrayByTag:function(tag){
		var retArray={};
		tag = DHTMLSuite.commonObj.getEl(tag);

		var els = tag.elements;
		if (!els) {
			els = this.getSubFieldsObjectByTag(tag);
		}
		for(var no=0;no<els.length;no++){
			if(els[no].disabled)continue;
			var tag=els[no].tagName.toLowerCase();
			var tagId = els[no].name;
			if (!tagId)	{
				tagId = els[no].id;
			}
			switch(tag){
			case "input":
				var type=els[no].type.toLowerCase();
				if(!type)type='text';
				switch(type){
				case "text":
				case "image":
				case "hidden":
				case "password":
					retArray[tagId]=els[no].value;
					break;
				case "checkbox":
					var boxes=this.getFamily(els[no],formRef);
					if(boxes.length>1){
						retArray[tagId]=[];
						for(var no2=0;no2<boxes.length;no2++){
							if(boxes[no2].checked){
								var index=retArray[tagId].length;
								retArray[tagId][index]=boxes[no2].value;
							}
						}
					}else{
						if(els[no].checked)retArray[tagId]=els[no].value;
					}
					break;
				case "radio":
					if(els[no].checked)retArray[tagId]=els[no].value;
					break;

				}
				break;
			case "select":
				var string='';
				var mult=els[no].getAttribute('multiple');
				if(mult||mult===''){
					retArray[tagId]=[];
					for(var no2=0;no2<els[no].options.length;no2++){
						var index=retArray[tagId].length;
						if(els[no].options[no2].selected)retArray[tagId][index]=els[no].options[no2].value;
					}
				}else{
					retArray[tagId]=els[no].options[els[no].selectedIndex].value;
				}
				break;
			case "textarea":
				retArray[tagId]=els[no].value;
				break;
			}
		}
		return retArray;
	},

	// 取某个标签下所有可提交的域
	getSubFieldsObjectByTag : function(submitEl) {
		if (!submitEl) return null;
		var el = DHTMLSuite.commonObj.getEl(submitEl);
		if (!el) return null;
		var listNodes = [];
		var list = el.getElementsByTagName("input");
		if (list) {
			for (var i=0;i<list.length ;i++ ) {
				listNodes[listNodes.length] = list[i];
			}
		}
		list = el.getElementsByTagName("select");
		if (list) {
			for (var i=0;i<list.length ;i++ ) {
				listNodes[listNodes.length] = list[i];
			}
		}
		list = el.getElementsByTagName("textarea");
		if (list) {
			for (var i=0;i<list.length ;i++ ) {
				listNodes[listNodes.length] = list[i];
			}
		}

		return listNodes;
	},

// {{{ __onError()
	/**
	*On error event
	 *
	*@param Integer ajaxIndex-Index of ajax object
	*@return String url-failing url
	 *
	*@private
	 */
	__onError:function(ajaxIndex,url){
		// alert('Could not send Ajax request to '+url);
	}
	
// }}}
	,
	
// {{{ __onComplete()
	/**
	*On complete event
	 *
	*@param Integer ajaxIndex-Index of ajax object
	*@return String functionNameOnComplete-function to execute
	 *
	*@private
	 */
	__onComplete:function(ajaxIndex,functionNameOnComplete){
	var ind=this.objectIndex;
	if(functionNameOnComplete){
		eval(functionNameOnComplete+'(DHTMLSuite.variableStorage.arrayDSObjects['+ind+'].ajaxObjects['+ajaxIndex+'])');
	}

	setTimeout('DHTMLSuite.variableStorage.arrayDSObjects['+ind+'].__deleteAjaxObject('+ajaxIndex+')',3000);
	}
	
// }}}
	,

	__onPortletComplete:function(ajaxIndex,divId){
		var ind=this.objectIndex;
		var obj = document.getElementById(divId);
		// 如果有xcontent式样，则将内容填充到里面
		obj = getElementByClassName(obj,"xcontent");
		var ajaxObj = DHTMLSuite.variableStorage.arrayDSObjects[ind].ajaxObjects[ajaxIndex];
		obj.innerHTML = ajaxObj.response;

		DHTMLSuite.commonObj.__evaluateJs(obj);

		setTimeout('DHTMLSuite.variableStorage.arrayDSObjects['+ind+'].__deleteAjaxObject('+ajaxIndex+')',3000);
	},
	
// {{{ __deleteAjaxObject()
	/**
	*Remove ajax object from memory
	 *
	*@param Integer ajaxIndex-Index of ajax object
	 *
	*@private
	 */
	__deleteAjaxObject:function(ajaxIndex){
	this.ajaxObjects[ajaxIndex]=false;
	}
};
	

DHTMLSuite.globalVariableStorage=function(){

	var arrayDSObjects;	
	this.arrayDSObjects=[];
	var ajaxObjects;
	this.ajaxObjects=[];
};

DHTMLSuite.globalVariableStorage.prototype={

};

/************************************************************************************************************
*	A class with general methods used by most of the scripts
*
*	Created:		August, 19th, 2006
*	Purpose of class:	A class containing common method used by one or more of the gui classes below,
* 			example: loadCSS.
*			An object("DHTMLSuite.commonObj")of this  class will always be available to the other classes.
* 	Update log:
*
************************************************************************************************************/

/**
* @constructor
* @class A class containing common method used by one or more of the gui classes below, example: loadCSS. An object("DHTMLSuite.commonObj")of this  class will always be available to the other classes.
* @version 1.0
* @author	Alf Magne Kalleland(www.dhtmlgoodies.com)
**/

DHTMLSuite.common=function(){
	var loadedCSSFiles;	
// Array of loaded CSS files. Prevent same CSS file from being loaded twice.
	var cssCacheStatus;	
// Css cache status
	var eventEls;
	var isOkToSelect;	
// Boolean variable indicating if it's ok to make text selections

	this.okToSelect=true;
	this.cssCacheStatus=true;	
// Caching of css files=on(Default)
	this.eventEls=[];
};

DHTMLSuite.common.prototype={

	
// {{{ init()
	/**
	*This method initializes the DHTMLSuite_common object.
	 *	This class contains a lot of useful methods used by most widgets.
	 *
	*@public
	 */
	init:function(){
	this.loadedCSSFiles=[];
	}
	
// }}}
	,
	
// {{{ loadCSS()
	/**
	*This method loads a CSS file(Cascading Style Sheet)dynamically-i.e. an alternative to <link> tag in the document.
	 *
	*@param string cssFile=Name of css file. It will be loaded from the path specified in the DHTMLSuite.common object
	*@param Boolean prefixConfigPath=Use config path as prefix.
	*@public
	 */
	loadCSS:function(cssFile,prefixConfigPath){
	if(!prefixConfigPath&&prefixConfigPath!==false)prefixConfigPath=true;
	if(!this.loadedCSSFiles[cssFile]){
		this.loadedCSSFiles[cssFile]=true;
		var lt=document.createElement('LINK');
		if(!this.cssCacheStatus){
		if(cssFile.indexOf('?')>=0)cssFile=cssFile+'&'; else cssFile=cssFile+'?';
		cssFile=cssFile+'rand='+ Math.random();	
// To prevent caching
		}
		if(prefixConfigPath){
		lt.href=DHTMLSuite.configObj.cssPath+cssFile;
		}else{
		lt.href=cssFile;
		}
		lt.rel='stylesheet';
		lt.media='screen';
		lt.type='text/css';
		document.getElementsByTagName('HEAD')[0].appendChild(lt);
	}
	}
	
// }}}
	,
	
// {{{ __setTextSelOk()
	/**
	*Is it ok to make text selections ?
	 *
	*@param Boolean okToSelect
	*@private
	 */
	__setTextSelOk:function(okToSelect){
	this.okToSelect=okToSelect;
	}
	
// }}}
	,
	
// {{{ __setTextSelOk()
	/**
	*Returns true if it's ok to make text selections, false otherwise.
	 *
	*@return Boolean okToSelect
	*@private
	 */
	__isTextSelOk:function(){
	return this.okToSelect;
	}
	
// }}}
	,
	
// {{{ setCssCacheStatus()
	/**
	*Specify if css files should be cached or not.
	 *
	 *	@param Boolean cssCacheStatus=true=cache on, false=cache off
	 *
	*@public
	 */
	setCssCacheStatus:function(cssCacheStatus){
	  this.cssCacheStatus=cssCacheStatus;
	}
	
// }}}
	,
	
// {{{ getEl()
	/**
	*Return a reference to an object
	 *
	*@param Object elRef=Id, name or direct reference to element
	*@return Object HTMLElement-direct reference to element
	*@public
	 */
	getEl:function(elRef){
	if(typeof elRef=='string'){
		if(document.getElementById(elRef))return document.getElementById(elRef);
		if(document.forms[elRef])return document.forms[elRef];
		if(document[elRef])return document[elRef];
		if(window[elRef])return window[elRef];
	}
	return elRef;	
// Return original ref.

	}
	
// }}}
	,
	
// {{{ isArray()
	/**
	*Return true if element is an array
	 *
	*@param Object el=Reference to HTML element
	*@public
	 */
	isArray:function(el){
	if(el.constructor.toString().indexOf("Array")!=-1)return true;
	return false;
	}
	
// }}}
	,
	
// {{{ getStyle()
	/**
	*Return specific style attribute for an element
	 *
	*@param Object el=Reference to HTML element
	*@param String property=Css property
	*@public
	 */
	getStyle:function(el,property){
	el=this.getEl(el);
	if (document.defaultView&&document.defaultView.getComputedStyle){
		var retVal=null;
		var comp=document.defaultView.getComputedStyle(el, '');
		if (comp){
		retVal=comp[property];
		}
		return el.style[property]||retVal;
	}
	if (document.documentElement.currentStyle&&DHTMLSuite.clientInfoObj.isMSIE){
		var retVal=null;
		if(el.currentStyle)value=el.currentStyle[property];
		return (el.style[property]||retVal);
	}
	return el.style[property];
	}
	
// }}}
	,
	
// {{{ getLeftPos()
	/**
	*This method will return the left coordinate(pixel)of an HTML element
	 *
	*@param Object el=Reference to HTML element
	*@public
	 */
	getLeftPos:function(el){
	/*
	if(el.getBoundingClientRect){ 
// IE
		var box=el.getBoundingClientRect();
		return (box.left/1+Math.max(document.body.scrollLeft,document.documentElement.scrollLeft));
	}
	*/
	if(document.getBoxObjectFor){
		if(el.tagName!='INPUT'&&el.tagName!='SELECT'&&el.tagName!='TEXTAREA')return document.getBoxObjectFor(el).x
	}
	var returnValue=el.offsetLeft;
	while((el=el.offsetParent)!=null){
		if(el.tagName!='HTML'){
		returnValue += el.offsetLeft;
		if(document.all)returnValue+=el.clientLeft;
		}
	}
	return returnValue;
	}
	
// }}}
	,
	
// {{{ getTopPos()
	/**
	*This method will return the top coordinate(pixel)of an HTML element/tag
	 *
	*@param Object el=Reference to HTML element
	*@public
	 */
	getTopPos:function(el){
	/*
	if(el.getBoundingClientRect){	
// IE
		var box=el.getBoundingClientRect();
		return (box.top/1+Math.max(document.body.scrollTop,document.documentElement.scrollTop));
	}
	*/
	if(document.getBoxObjectFor){
		if(el.tagName!='INPUT'&&el.tagName!='SELECT'&&el.tagName!='TEXTAREA')return document.getBoxObjectFor(el).y
	}

	var returnValue=el.offsetTop;
	while((el=el.offsetParent)!=null){
		if(el.tagName!='HTML'){
		returnValue += (el.offsetTop-el.scrollTop);
		if(document.all)returnValue+=el.clientTop;
		}
	}
	return returnValue;
	}
	
// }}}
	,
	
// {{{ getCookie()
	/**
	 *
	*	These cookie functions are downloaded from
	*	http:
//www.mach5.com/support/analyzer/manual/html/General/CookiesJavaScript.htm
	 *
	* This function returns the value of a cookie
	 *
	*@param String name=Name of cookie
	*@param Object inputObj=Reference to HTML element
	*@public
	 */
	getCookie:function(name){
	var start=document.cookie.indexOf(name+"=");
	var len=start+name.length+1;
	if ((!start)&&(name!=document.cookie.substring(0,name.length)))return null;
	if (start==-1)return null;
	var end=document.cookie.indexOf(";",len);
	if (end==-1)end=document.cookie.length;
	return unescape(document.cookie.substring(len,end));
	}
	
// }}}
	,
	
// {{{ setCookie()
	/**
	 *
	*	These cookie functions are downloaded from
	*	http:
//www.mach5.com/support/analyzer/manual/html/General/CookiesJavaScript.htm
	 *
	* This function creates a cookie. (This method has been slighhtly modified)
	 *
	*@param String name=Name of cookie
	*@param String value=Value of cookie
	*@param Int expires=Timestamp-days
	*@param String path=Path for cookie (Usually left empty)
	*@param String domain=Cookie domain
	*@param Boolean secure=Secure cookie(SSL)
	 *
	*@public
	 */
	setCookie:function(name,value,expires,path,domain,secure){
	expires=expires*60*60*24*1000;
	var today=new Date();
	var expires_date=new Date( today.getTime()+(expires));
	var cookieString=name+"=" +escape(value)+
		((expires)?";expires="+expires_date.toGMTString():"")+
		((path)?";path="+path:"")+
		((domain)?";domain="+domain:"")+
		((secure)?";secure":"");
	document.cookie=cookieString;
	}
	
// }}}
	,
	
// {{{ deleteCookie()
	/**
	 *
	* This function deletes a cookie. (This method has been slighhtly modified)
	 *
	*@param String name=Name of cookie
	*@param String path=Path for cookie (Usually left empty)
	*@param String domain=Cookie domain
	 *
	*@public
	 */
	deleteCookie:function( name, path, domain )
	{
	if ( this.getCookie( name ))document.cookie=name+"=" +
	(( path )?";path="+path:"")+
	(( domain )?";domain="+domain:"" )+
	";expires=Thu, 01-Jan-1970 00:00:01 GMT";
	}
	
// }}}
	,
	
// {{{ cancelEvent()
	/**
	 *
	* This function only returns false. It is used to cancel selections and drag
	 *
	 *
	*@public
	 */

	cancelEvent:function(){
	return false;
	}
	
// }}}
	,
	
// {{{ addEvent()
	/**
	 *
	* This function adds an event listener to an element on the page.
	 *
	 *	@param Object whichObject=Reference to HTML element(Which object to assigne the event)
	 *	@param String eventType=Which type of event, example "mousemove" or "mouseup" (NOT "onmousemove")
	 *	@param functionName=Name of function to execute.
	 *
	*@public
	 */
	addEvent:function( obj, type, fn,suffix ){
	if(!suffix)suffix='';
	if ( obj.attachEvent ){
		if ( typeof DHTMLSuite_funcs[type+fn+suffix]!='function'){
		DHTMLSuite_funcs[type+fn+suffix]=function(){
			fn.apply(window.event.srcElement);
		};
		obj.attachEvent('on'+type, DHTMLSuite_funcs[type+fn+suffix] );
		}
		obj=null;
	} else {
		obj.addEventListener( type, fn, false );
	}
	this.__addEventEl(obj);
	}

	
// }}}
	,
	
// {{{ removeEvent()
	/**
	 *
	* This function removes an event listener from an element on the page.
	 *
	 *	@param Object whichObject=Reference to HTML element(Which object to assigne the event)
	 *	@param String eventType=Which type of event, example "mousemove" or "mouseup"
	 *	@param functionName=Name of function to execute.
	 *
	*@public
	 */
	removeEvent:function(obj,type,fn,suffix){
	if ( obj.detachEvent ){
	obj.detachEvent( 'on'+type, DHTMLSuite_funcs[type+fn+suffix] );
		DHTMLSuite_funcs[type+fn+suffix]=null;
		obj=null;
	} else {
		obj.removeEventListener( type, fn, false );
	}
	}
	
// }}}
	,
	
// {{{ __clearMemoryGarbage()
	/**
	 *
	* This function is used for Internet Explorer in order to clear memory when the page unloads.
	 *
	 *
	*@private
	 */
	__clearMemoryGarbage:function(){
		/* Example of event which causes memory leakage in IE
		DHTMLSuite.commonObj.addEvent(expandRef,"click",function(){ window.refToMyMenuBar[index].__changeMenuBarState(this); })
		We got a circular reference.
		*/
	if(!DHTMLSuite.clientInfoObj.isMSIE)return;

	for(var no=0;no<DHTMLSuite.eventEls.length;no++){
		try{
		var el=DHTMLSuite.eventEls[no];
		el.onclick=null;
		el.onmousedown=null;
		el.onmousemove=null;
		el.onmouseout=null;
		el.onmouseover=null;
		el.onmouseup=null;
		el.onfocus=null;
		el.onblur=null;
		el.onkeydown=null;
		el.onkeypress=null;
		el.onkeyup=null;
		el.onselectstart=null;
		el.ondragstart=null;
		el.oncontextmenu=null;
		el.onscroll=null;
		el=null;
		}catch(e){
		}
	}

	for(var no in DHTMLSuite.variableStorage.arrayDSObjects){
		DHTMLSuite.variableStorage.arrayDSObjects[no]=null;
	}

	window.onbeforeunload=null;
	window.onunload=null;
	DHTMLSuite=null;
	}
	
// }}}
	,
	
// {{{ __addEventEl()
	/**
	 *
	* Add element to garbage collection array. The script will loop through this array and remove event handlers onload in ie.
	 *
	 *
	*@private
	 */
	__addEventEl:function(el){
	DHTMLSuite.eventEls[DHTMLSuite.eventEls.length]=el;
	}
	
// }}}
	,
	
// {{{ getSrcElement()
	/**
	 *
	* Returns a reference to the HTML element which triggered an event.
	 *	@param Event e=Event object
	 *
	 *
	*@public
	 */
	getSrcElement:function(e){
	var el;
	if (e.target)el=e.target;
		else if (e.srcElement)el=e.srcElement;
		if (el.nodeType==3)
// defeat Safari bug
		el=el.parentNode;
	return el;
	}
	
// }}}
	,
	
// {{{ getKeyFromEvent()
	/**
	 *
	* Returns key from event object
	 *	@param Event e=Event object
	 *
	*@public
	 */
	getKeyFromEvent:function(e){
	var code=this.getKeyCode(e);
	return String.fromCharCode(code);
	}
	
// }}}
	,
	
// {{{ getKeyCode()
	/**
	 *
	* Returns key code from event
	 *	@param Event e=Event object
	 *
	*@public
	 */
	getKeyCode:function(e){
	if (e.keyCode)code=e.keyCode; else if (e.which)code=e.which;
	return code;
	}
	
// }}}
	,
	
// {{{ isObjectClicked()
	/**
	 *
	* Returns true if an object is clicked, false otherwise. This method will also return true if you clicked on a sub element
	 *	@param Object obj=Reference to HTML element
	 *	@param Event e=Event object
	 *
	 *
	*@public
	 */
	isObjectClicked:function(obj,e){
	var src=this.getSrcElement(e);
	var string=src.tagName+'('+src.className+')';
	if(src==obj)return true;
	while(src.parentNode&&src.tagName.toLowerCase()!='html'){
		src=src.parentNode;
		string=string+','+src.tagName+'('+src.className+')';
		if(src==obj)return true;
	}
	return false;
	}
	
// }}}
	,
	
// {{{ getObjectByClassName()
	/**
	 *
	* Walks up the DOM tree and returns first found object with a given class name
	 *
	 *	@param Event e=Event object
	 *	@param String className=CSS-Class name
	 *
	 *
	*@public
	 */
	getObjectByClassName:function(e,className){
	var src=this.getSrcElement(e);
	if(src.className==className)return src;
	while(src&&src.tagName.toLowerCase()!='html'){
		src=src.parentNode;
		if(src.className==className)return src;
	}
	return false;
	}
	
//}}}
	,
	
// {{{ getObjectByAttribute()
	/**
	 *
	* Walks up the DOM tree and returns first found object with a given attribute set
	 *
	 *	@param Event e=Event object
	 *	@param String attribute=Custom attribute
	 *
	 *
	*@public
	 */
	getObjectByAttribute:function(e,attribute){
	var src=this.getSrcElement(e);
	var att=src.getAttribute(attribute);
	if(!att)att=src[attribute];
	if(att)return src;
	while(src&&src.tagName.toLowerCase()!='html'){
		src=src.parentNode;
		var att=src.getAttribute('attribute');
		if(!att)att=src[attribute];
		if(att)return src;
	}
	return false;
	}
	
//}}}
	,
	
// {{{ getUniqueId()
	/**
	 *
	* Returns a unique numeric id
	 *
	 *
	 *
	*@public
	 */
	getUniqueId:function(){
	var no=Math.random()+'';
	no=no.replace('.','');
	var no2=Math.random()+'';
	no2=no2.replace('.','');
	return no+no2;
	}
	
// }}}
	,
	
// {{{ getAssociativeArrayFromString()
	/**
	 *
	* Returns an associative array from a comma delimited string
	* @param String propertyString-commaseparated string(example: "id:myid,title:My title,contentUrl:includes/tab.inc")
	 *
	 *	@return Associative array of keys+property value(example: key: id, value:myId)
	*@public
	 */
	getAssociativeArrayFromString:function(propertyString){
	if(!propertyString)return;
	var retArray=[];
	var items=propertyString.split(/,/g);
	for(var no=0;no<items.length;no++){
		var tokens=items[no].split(/:/);
		retArray[tokens[0]]=tokens[1];
	}
	return retArray;
	}
	
// }}}
	,
	
// {{{ correctPng()
	/**
	 *
	* Correct png for old IE browsers
	* @param Object el-Id or direct reference to image
	 *
	*@public
	 */
	correctPng:function(el){
	el=DHTMLSuite.commonObj.getEl(el);
	var img=el;
	var width=img.width;
	var height=img.height;
	var html='<span style="display:inline-block;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\''+img.src+'\',sizingMethod=\'scale\');width:'+width+';height:'+height+'"></span>';
	img.outerHTML=html;

	}
	,
	
// {{{ __evaluateJs()
	/**
	*Evaluate Javascript in the inserted content
	 *
	*@private
	 */
	__evaluateJs:function(obj){
	obj=this.getEl(obj);
	var scriptTags=obj.getElementsByTagName('SCRIPT');
	var string='';
	var jsCode='';
	for(var no=0;no<scriptTags.length;no++){
		if(scriptTags[no].src){
		var head=document.getElementsByTagName("head")[0];
		var scriptObj=document.createElement("script");

		scriptObj.setAttribute("type", "text/javascript");
		scriptObj.setAttribute("src", scriptTags[no].src);
		}else{
		if(DHTMLSuite.clientInfoObj.isOpera){
			jsCode=jsCode+scriptTags[no].text+'\n';
		}
		else
			jsCode=jsCode+scriptTags[no].innerHTML;
		}
	}
	if(jsCode)this.__installScript(jsCode);
	}
	
// }}}
	,
	
// {{{ __installScript()
	/**
	* "Installs" the content of a <script> tag.
	 *
	*@private
	 */
	__installScript:function ( script ){
	try{
		if (!script)
		return;
		if (window.execScript){
		window.execScript(script)
		}else if(window.jQuery&&jQuery.browser.safari){ 
// safari detection in jQuery
		window.setTimeout(script,0);
		}else{
		window.setTimeout( script, 0 );
		}
	}catch(e){

	}
	}
	
// }}}
	,
	
// {{{ __evaluateCss()
	/**
	* Evaluates css
	 *
	*@private
	 */
	__evaluateCss:function(obj){
	obj=this.getEl(obj);
	var cssTags=obj.getElementsByTagName('STYLE');
	var head=document.getElementsByTagName('HEAD')[0];
	for(var no=0;no<cssTags.length;no++){
		head.appendChild(cssTags[no]);
	}
	}
};


DHTMLSuite.createStandardObjects=function(){

	DHTMLSuite.clientInfoObj = new DHTMLSuite.clientInfo();	
	// Create browser info object
	DHTMLSuite.clientInfoObj.init();
	if(!DHTMLSuite.configObj){	// If this object isn't allready created, create it.
		DHTMLSuite.configObj = new DHTMLSuite.config();	// Create configuration object.
		DHTMLSuite.configObj.init();
	}

	DHTMLSuite.commonObj=new DHTMLSuite.common();


	DHTMLSuite.variableStorage = new DHTMLSuite.globalVariableStorage();
	DHTMLSuite.commonObj.init();

	DHTMLSuite.commonObj.addEvent(window,'unload',function(){ DHTMLSuite.commonObj.__clearMemoryGarbage(); });

	standardObjectsCreated=true;
};

/************************************************************************************************************
*	Configuration class used by most of the scripts
*
*	Created:			August, 19th, 2006
* 	Update log:
*
************************************************************************************************************/

/**
* @constructor
* @class Store global variables/configurations used by the classes below. Example: If you want to
*		 change the path to the images used by the scripts, change it here. An object of this
*		 class will always be available to the other classes. The name of this object is
*		"DHTMLSuite.configObj".	<br><br>
*
*		If you want to create an object of this class manually, remember to name it "DHTMLSuite.configObj"
*		This object should then be created before any other objects. This is nescessary if you want
*		the other objects to use the values you have put into the object. <br>
* @version				1.0
* @version 1.0
* @author	Alf Magne Kalleland(www.dhtmlgoodies.com)
**/
DHTMLSuite.config = function(){
	var imagePath;	// Path to images used by the classes.
	var cssPath;	// Path to CSS files used by the DHTML suite.

	var defaultCssPath;
	var defaultImagePath;
};

DHTMLSuite.config.prototype = {
	// {{{ init()
	/**
	 * 	Initializes the config object - the config class is used to store global properties used by almost all widgets
	 *
	 * @public
	 */
	init : function(){
		this.imagePath = DHTML_SUITE_THEME_FOLDER + DHTML_SUITE_THEME + '/images/';	// Path to images
		this.cssPath = DHTML_SUITE_THEME_FOLDER + DHTML_SUITE_THEME + '/css/';	// Path to images

		this.defaultCssPath = this.cssPath;
		this.defaultImagePath = this.imagePath;

	}
	// }}}
	,
	// {{{ setCssPath()
	/**
	 * This method will save a new CSS path, i.e. where the css files of the dhtml suite are located(the folder).
	 *	This method is rarely used. Default value is the variable DHTML_SUITE_THEME_FOLDER + DHTML_SUITE_THEME + '/css',
	 *	which means that the css path is set dynamically based on which theme you choose.
	 *
	 * @param string newCssPath = New path to css files(folder - remember to have a slash(/) at the end)
	 * @public
	 */

	setCssPath : function(newCssPath){
		this.cssPath = newCssPath;
	}
	// }}}
	,
	// {{{ resetCssPath()
	/**
	 * @deprecated
	 * Resets css path back to default value which is ../css_dhtmlsuite/
	 * This method is deprecated.
	 *
	 * @public
	 */
	resetCssPath : function(){
		this.cssPath = this.defaultCssPath;
	}
	// }}}
	,
	// {{{ resetImagePath()
	/**
	 * @deprecated
	 *
	 * Resets css path back to default path which is DHTML_SUITE_THEME_FOLDER + DHTML_SUITE_THEME + '/css'
	 * This method is deprecated.
	 * @public
	 */
	resetImagePath : function(){
		this.imagePath = this.defaultImagePath;
	}
	// }}}
	,
	// {{{ setImagePath()
	/**
	 * This method will save a new image file path, i.e. where the image files used by the dhtml suite ar located
	 *
	 * @param string newImagePath = New path to image files (remember to have a slash(/) at the end)
	 * @public
	 */
	setImagePath : function(newImagePath){
		this.imagePath = newImagePath;
	}
	// }}}
};

/************************************************************************************************************
*	Client info class
*
*	Created:		August, 18th, 2006
* 	Update log:
*
************************************************************************************************************/

/**
* @constructor
* @class Purpose of class: Provide browser information to the classes below. Instead of checking for
*	 browser versions and browser types in the classes below, they should check this
*	 easily by referncing properties in the class below. An object("DHTMLSuite.clientInfoObj")of this
*	 class will always be accessible to the other classes.*@version 1.0
* @author	Alf Magne Kalleland(www.dhtmlgoodies.com)
**/

DHTMLSuite.clientInfo=function(){
	var browser;		
// Complete user agent information

	var isOpera;		
// Is the browser "Opera"
	var isMSIE;		
// Is the browser "Internet Explorer"
	var isOldMSIE;		
// Is this browser and older version of Internet Explorer ( by older, we refer to version 6.0 or lower)
	var isFirefox;		
// Is the browser "Firefox"
	var navigatorVersion;	
// Browser version
	var isOldMSIE;
};

DHTMLSuite.clientInfo.prototype={

	
// {{{ init()
	/**
	* This method initializes the clientInfo object. This is done automatically when you create a widget object.
	 *
	*@public
	 */
	init:function(){
	this.browser=navigator.userAgent;
	this.isOpera=(this.browser.toLowerCase().indexOf('opera')>=0)?true:false;
	this.isFirefox=(this.browser.toLowerCase().indexOf('firefox')>=0)?true:false;
	this.isMSIE=(this.browser.toLowerCase().indexOf('msie')>=0)?true:false;
	this.isOldMSIE=(this.browser.toLowerCase().match(/msie\s[0-6]/gi))?true:false;
	this.isSafari=(this.browser.toLowerCase().indexOf('safari')>=0)?true:false;
	this.navigatorVersion=navigator.appVersion.replace(/.*?MSIE\s(\d\.\d).*/g,'$1')/1;
	this.isOldMSIE=(this.isMSIE&&this.navigatorVersion<7)?true:false;
	}
	
// }}}
	,
	
// {{{ getBrowserWidth()
	/**
	 *
	 *
	* This method returns the width of the browser window(i.e. inner width)
	 *
	 *
	*@public
	 */
	getBrowserWidth:function(){
	if(self.innerWidth)return self.innerWidth;
	return document.documentElement.offsetWidth;
	}
	
// }}}
	,
	
// {{{ getBrowserHeight()
	/**
	 *
	 *
	* This method returns the height of the browser window(i.e. inner height)
	 *
	 *
	*@public
	 */
	getBrowserHeight:function(){
	if(self.innerHeight)return self.innerHeight;
	return document.documentElement.offsetHeight;
	}
};













/************************************************************************************************************
*	Form submission class
*
*	Created:			March, 6th, 2007
*	@class Purpose of class:	Ajax form submission class
*
*	Css files used by this script:
*
*	Demos of this class:		demo-form-validator.html
*
* 	Update log:
*
************************************************************************************************************/

/**
* @constructor
* @class Form submission
* Demo: <a href="../../demos/demo-form-validator.html" target="_blank">demo-form-validator.html</a>
*
* @param Object-formRef-Reference to form
* @version		1.0
* @version 1.0
* @author	Alf Magne Kalleland(www.dhtmlgoodies.com)
**/

DHTMLSuite.formUtil=function(){

};

DHTMLSuite.formUtil.prototype =
{
	
// {{{ getFamily
	/**
	 *	Return an array of elements with the same name
	 *	@param Object el-Reference to form element
	 *	@param Object formRef-Reference to form
	 *
	*@public
	 */
	getFamily:function(el,formRef){
	var els=formRef.elements;
	var retArray=[];
	for(var no=0;no<els.length;no++){
		if(els[no].name==el.name)retArray[retArray.length]=els[no];
	}
	return retArray;
	}
	
// }}}
	,
	
// {{{ hasFileInputs()
	/**
	 *	Does the form has file inputs?
	 *	@param Object formRef-Reference to form
	 *
	*@public
	 */
	hasFileInputs:function(formRef){
	var els=formRef.elements;
	if (!els) return false;

	for(var no=0;no<els.length;no++){
		if(els[no].tagName.toLowerCase()=='input'&&els[no].type.toLowerCase()=='file')return true;
	}
	return false;
	}
	
// }}}
	,
	
// {{{ getValuesAsArray()
	/**
	 *	Return value of form as associative array
	 *	@param Object formRef-Reference to form
	 *
	*@public
	 */
	getValuesAsArray:function(formRef){
	var retArray={};
	formRef=DHTMLSuite.commonObj.getEl(formRef);

	var els=formRef.elements;
	if (!els) {
		els = this.getSubFieldsObjectByTag(formRef);
	}
	for(var no=0;no<els.length;no++){
		if(els[no].disabled)continue;
		var tag=els[no].tagName.toLowerCase();
		var tagId = els[no].name;
		if (!tagId)	{
			tagId = els[no].id;
		}
		switch(tag){
		case "input":
			var type=els[no].type.toLowerCase();
			if(!type)type='text';
			switch(type){
			case "text":
			case "image":
			case "hidden":
			case "password":
				retArray[tagId]=els[no].value;
				break;
			case "checkbox":
				var boxes=this.getFamily(els[no],formRef);
				if(boxes.length>1){
					retArray[tagId]=[];
					for(var no2=0;no2<boxes.length;no2++){
						if(boxes[no2].checked){
						var index=retArray[tagId].length;
						retArray[tagId][index]=boxes[no2].value;
						}
					}
				}else{
					if(els[no].checked)retArray[tagId]=els[no].value;
				}
				break;
			case "radio":
				if(els[no].checked)retArray[tagId]=els[no].value;
				break;

			}
			break;
		case "select":
			var string='';
			var mult=els[no].getAttribute('multiple');
			if(mult||mult===''){
			retArray[tagId]=[];
			for(var no2=0;no2<els[no].options.length;no2++){
				var index=retArray[tagId].length;
				if(els[no].options[no2].selected)retArray[tagId][index]=els[no].options[no2].value;
			}
			}else{
			retArray[tagId]=els[no].options[els[no].selectedIndex].value;
			}
			break;
		case "textarea":
			retArray[tagId]=els[no].value;
			break;
		}
	}
	return retArray;
	}
	
// }}}
	,

	// 根据列表取标签域值
	getFieldsObject : function(tags) {
		if (!tags) return null;
		if (typeof(tags)=="object") return tags;
		var inputs = [];
		var fields = tags.split(',');
		for (var no=0;no<fields.length ;no++ ) {
			var obj = DHTMLSuite.commonObj.getEl(fields[no]);
			if (!obj) continue;
			inputs[inputs.length] = obj;
		}

		return inputs;
	},
	// 取某个标签下所有可提交的域
	getSubFieldsObjectByTag : function(submitEl) {
		if (!submitEl) return null;
		var el = DHTMLSuite.commonObj.getEl(submitEl);
		if (!el) return null;
		var listNodes = [];
		var list = el.getElementsByTagName("input");
		if (list) {
			for (var i=0;i<list.length ;i++ ) {
				listNodes[listNodes.length] = list[i];
			}
		}
		list = el.getElementsByTagName("select");
		if (list) {
			for (var i=0;i<list.length ;i++ ) {
				listNodes[listNodes.length] = list[i];
			}
		}
		list = el.getElementsByTagName("textarea");
		if (list) {
			for (var i=0;i<list.length ;i++ ) {
				listNodes[listNodes.length] = list[i];
			}
		}

		return listNodes;
	},
	
// {{{ getValue()
	/**
	 *	Return value of form element
	 *	@param Object formEl-Reference to form element
	 *
	*@public
	 */
	getValue:function(formEl){
	switch(formEl.tagName.toLowerCase()){
		case "input":
		case "textarea": return formEl.value;
		case "select": return formEl.options[formEl.selectedIndex].value;
	}

	}
	
// }}}
	,
	
// {{{ areEqual()
	/**
	 *	Check if two form elements have the same value
	 *	@param Object input1-Reference to form element
	 *	@param Object input2-Reference to form element
	 *
	*@public
	 */
	areEqual:function(input1,input2){
	input1=DHTMLSuite.commonObj.getEl(input1);
	input2=DHTMLSuite.commonObj.getEl(input2);
	if(this.getValue(input1)==this.getValue(input2))return true;
	return false;
	}
};

/************************************************************************************************************
*	Form submission class
*
*	Created:			March, 6th, 2007
*	@class Purpose of class:	Ajax form submission class
*
*	Css files used by this script:	form.css
*
*	Demos of this class:		demo-form-validator.html
*
* 	Update log:
*
************************************************************************************************************/

/**
* @constructor
* @class Form submission
* Demo: <a href="../../demos/demo-form-validator.html" target="_blank">demo-form-validator.html</a>
*
* @param Associative array of properties, possible keys: <br>
*	formRef-Reference to form<br>
*	method-How to send the form, "GET" or "POST", default is "POST"
*	reponseEl-Where to display response from ajax
*	action-Where to send form data
*	responseFile-Alternative response file. This will be loaded dynamically once the script receives response from the file specified in "action".
*
* @version		1.0
* @version 1.0
* @author	Alf Magne Kalleland(www.dhtmlgoodies.com)
**/

DHTMLSuite.form=function(propArray){
	var formRef;
	var method;
	var responseEl;
	var action;
	var responseFile;

	var formUtil;
	var objectIndex;
	var sack;
	var coverDiv;
	var layoutCSS;
	var iframeName;

	this.method='POST';
	this.sack=[];
	this.formUtil=new DHTMLSuite.formUtil();
	this.layoutCSS='form.css';

	try{
	if(!standardObjectsCreated)DHTMLSuite.createStandardObjects();	
// This line starts all the init methods
	}catch(e){
	alert('You need to include the dhtmlSuite-common.js file');
	}

	this.objectIndex=DHTMLSuite.variableStorage.arrayDSObjects.length;
	DHTMLSuite.variableStorage.arrayDSObjects[this.objectIndex]=this;

	DHTMLSuite.commonObj.loadCSS(this.layoutCSS);

	if(propArray)this.__setInitProperties(propArray);

};
DHTMLSuite.form.prototype =
{
	
// {{{ submit()
	/**
	 *	Submits the form
	 *
	*@public
	 */
	submit:function(){
	this.__createCoverDiv();
	var index=this.sack.length;
	if(this.formUtil.hasFileInputs(this.formRef)){
		this.__createIframe();
		this.formRef.submit();

	}else{
		this.__createsackect(index);
		this.__populateSack(index);
		this.sack[index].runAJAX(this.action);
	}
	this.__positionCoverDiv();
	return false;
	}
	
// }}}
	,
	__createIframe:function(){
	if(this.iframeName)return;
	var ind=this.objectIndex;
	var div=document.createElement('DIV');
	document.body.appendChild(div);
	this.iframeName='DHTMLSuiteForm'+DHTMLSuite.commonObj.getUniqueId();
	div.innerHTML='<iframe style="visibility:hidden;width:5px;height:5px" id="'+this.iframeName+'" name="'+this.iframeName+'" onload="parent.DHTMLSuite.variableStorage.arrayDSObjects['+ind+'].__getIframeResponse()"></iframe>';
	this.formRef.method=this.method;
	this.formRef.action=this.action;
	this.formRef.target=this.iframeName;
	if(!this.formRef.enctype)this.formRef.enctype='multipart/form-data';

	}
	
// }}}
	,
	
// {{{ __getIframeResponse()
	/**
	 *	Form has been submitted to iframe-move content from iframe
	 *
	*@private
	 */
	__getIframeResponse:function(){
	if(this.responseEl){
		if(this.responseFile){
		if(!this.responseEl.id)this.responseEl.id='DHTMLSuite_formResponse'+DHTMLSuite.getUniqueId();
		var dynContent=new DHTMLSuite.dynamicContent();
		dynContent.loadContent(this.responseEl.id,this.responseFile);
		}else{
		this.responseEl.innerHTML=self.frames[this.iframeName].document.body.innerHTML;
		DHTMLSuite.commonObj.__evaluateJs(this.responseEl);
		DHTMLSuite.commonObj.__evaluateCss(this.responseEl);
		}
	}
	this.coverDiv.style.display='none';
	this.__handleCallback('onComplete');
	}
	
// }}}
	,
	
// {{{ __positionCoverDiv()
	/**
	 *	Position cover div
	 *
	*@private
	 */
	__positionCoverDiv:function(){
	if(!this.responseEl)return;
	try{
		var st=this.coverDiv.style;
		st.left=DHTMLSuite.commonObj.getLeftPos(this.responseEl)+'px';
		st.top=DHTMLSuite.commonObj.getTopPos(this.responseEl)+'px';
		st.width=this.responseEl.offsetWidth+'px';
		st.height=this.responseEl.offsetHeight+'px';
		st.display='block';
	}catch(e){
	}
	}
	
// }}}
	,
	
// {{{ __createCoverDiv()
	/**
	 *	Submits the form
	 *
	*@private
	 */
	__createCoverDiv:function(){
	if(this.coverDiv)return;
	this.coverDiv=document.createElement('DIV');
	var el=this.coverDiv;
	el.style.overflow='hidden';
	el.style.zIndex=1000;
	el.style.position='absolute';
	el.style.display = 'none';

	document.body.appendChild(el);

	var innerDiv=document.createElement('DIV');
	innerDiv.style.width='105%';
	innerDiv.style.height='105%';
	innerDiv.className='DHTMLSuite_formCoverDiv';
	innerDiv.style.opacity='0.2';
	innerDiv.style.filter='alpha(opacity=20)';
	el.appendChild(innerDiv);

	var ajaxLoad=document.createElement('DIV');
	ajaxLoad.className='DHTMLSuite_formCoverDiv_ajaxLoader';
	el.appendChild(ajaxLoad);
	}
	
// }}}
	,
	
// {{{ __createsackect()
	/**
	 *	Create new sack object
	 *
	*@private
	 */
	__createsackect:function(ajaxIndex){
	var ind=this.objectIndex;
	this.sack[ajaxIndex]=new sack();
	this.sack[ajaxIndex].requestFile=this.action;
	this.sack[ajaxIndex].method=this.method;
	this.sack[ajaxIndex].onCompletion=function(){ DHTMLSuite.variableStorage.arrayDSObjects[ind].__getResponse(ajaxIndex); }
	}
	
// }}}
	,
	
// {{{ __getResponse()
	/**
	 *	Get response from ajax
	 *
	*@private
	 */
	__getResponse:function(ajaxIndex){
	if(this.responseEl){
		if(this.responseFile){
		if(!this.responseEl.id)this.responseEl.id='DHTMLSuite_formResponse'+DHTMLSuite.getUniqueId();
		var dynContent=new DHTMLSuite.dynamicContent();
		dynContent.loadContent(this.responseEl.id,this.responseFile);
		}else{
		this.responseEl.innerHTML=this.sack[ajaxIndex].response;
		DHTMLSuite.commonObj.__evaluateJs(this.responseEl);
		DHTMLSuite.commonObj.__evaluateCss(this.responseEl);
		}
	}

	if (this.callbackOnComplete) {
		var callbackString = this.callbackOnComplete;
		if(callbackString.indexOf('(')==-1)callbackString=callbackString+'(' + this.sack[ajaxIndex].response +')';
		eval(callbackString);
		return;
	}

	this.coverDiv.style.display='none';
	this.sack[ajaxIndex]=null;
	this.__handleCallback('onComplete');
	}
	
// }}}
	,
	
// {{{ __populateSack()
	/**
	 *	Populate sack object with form data
	 *	@param ajaxIndex-index of current sack object
	 *
	*@private
	 */
	__populateSack:function(ajaxIndex){
	var els=this.formUtil.getValuesAsArray(this.formRef);
	for(var prop in els){
		if(DHTMLSuite.commonObj.isArray(els[prop])){
			var value = "";
			for(var no=0;no<els[prop].length;no++){
				if (value!="")
					value += ",";
				value += els[prop][no];
			}
			this.sack[ajaxIndex].setVar(prop,value);
		}else{
			this.sack[ajaxIndex].setVar(prop,els[prop]);
		}
	}
	}
	
// }}}
	,
	
// {{{ __setInitProperties()
	/**
	 *	Fill object with data sent to the constructor
	 *	@param Array props-Associative Array("Object")of properties
	 *
	*@private
	 */
	__setInitProperties:function(props){
	if(props.formRef)this.formRef=DHTMLSuite.commonObj.getEl(props.formRef);
	if(props.method)this.method=props.method;
	if(props.responseEl)this.responseEl=DHTMLSuite.commonObj.getEl(props.responseEl);
	if(props.action)this.action=props.action;
	if(props.responseFile)this.responseFile=props.responseFile;
	if(props.callbackOnComplete)this.callbackOnComplete=props.callbackOnComplete;
	if(!this.action)this.action=this.formRef.action;
	if(!this.method)this.method=this.formRef.method;
	}
	
// }}}
	,
	
// {{{ __handleCallback()
	/**
	 *	Execute callback
	 *	@param String action-Which callback action
	 *
	*@private
	 */
	__handleCallback:function(action){
	var callbackString='';
	switch(action){
		case "onComplete":
		callbackString=this.callbackOnComplete;
		break;

	}
	if(callbackString){
		if(callbackString.indexOf('(')==-1)callbackString=callbackString+'("'+this.formRef.name+'")';
		eval(callbackString);
	}

	}
};

/**
*	Ajax dynamic content script
*
*	Created:			August, 23rd, 2006
*
*
* 	Update log:
*
************************************************************************************************************/
/**
* @constructor
* @class The purpose of this class is to load content of external files into HTML elements on your page(<a href="../../demos/demo-dynamic-content-1.html" target="_blank">demo</a>).<br>
*	 The pane splitter, window widget and the ajax tooltip script are also using this class to put external content into HTML elements.
* @version		1.0
* @version 1.0
*
* @author	Alf Magne Kalleland(www.dhtmlgoodies.com)
**/

DHTMLSuite.dynamicContent=function(){
	var enableCache;	
// Cache enabled.
	var jsCache;
	var ajaxObjects;
	var waitMessage;

	this.enableCache=true;
	this.jsCache={};
	this.ajaxObjects=[];
	this.waitMessage='Loading content-please wait...';
	this.waitImage='dynamic-content/ajax-loader-darkblue.gif';
	try{
	if(!standardObjectsCreated)DHTMLSuite.createStandardObjects();	
// This line starts all the init methods
	}catch(e){
	alert('You need to include the dhtmlSuite-common.js file');
	}
	var objectIndex;

	this.objectIndex=DHTMLSuite.variableStorage.arrayDSObjects.length;
	DHTMLSuite.variableStorage.arrayDSObjects[this.objectIndex]=this;

};

DHTMLSuite.dynamicContent.prototype={

	
// {{{ loadContent()
	/**
	*Load content from external files into an element on your web page.
	 *
	*@param String divId=Id of HTML element
	*@param String url=Path to content on the server(Local content only)
	*@param String functionToCallOnLoaded=Function to call when ajax is finished. This string will be evaulated, example of string: "fixContent()" (with the quotes).
	 *
	*@public
	 */
	loadContent:function(divId,url,functionToCallOnLoaded){

	var ind=this.objectIndex;
	if(this.enableCache&&this.jsCache[url]){
		document.getElementById(divId).innerHTML=this.jsCache[url];
		DHTMLSuite.commonObj.__evaluateJs(divId);
		DHTMLSuite.commonObj.__evaluateCss(divId);
		if(functionToCallOnLoaded)eval(functionToCallOnLoaded);
		return;
	}
	var ajaxIndex=0;

	/* Generating please wait message */
	var waitMessageToShow='';
	if(this.waitImage){	
// Wait image exists ?
		waitMessageToShow=waitMessageToShow+'<div style="text-align:center;padding:10px"><img src="'+DHTMLSuite.configObj.imagePath+this.waitImage+'" border="0" alt=""></div>';
	}
	if(this.waitMessage){	
// Wait message exists ?
		waitMessageToShow=waitMessageToShow+'<div style="text-align:center">'+this.waitMessage+'</div>';
	}

	if(this.waitMessage!=null&&this.waitImage!=null){
		try{
		if(waitMessageToShow.length>0)document.getElementById(divId).innerHTML=waitMessageToShow;
		}catch(e){
		}
	}
	waitMessageToShow=false;
	var ajaxIndex=this.ajaxObjects.length;

	try{
		this.ajaxObjects[ajaxIndex]=new sack();
	}catch(e){
		alert('Could not create ajax object. Please make sure that ajax.js is included');
	}

	if(url.indexOf('?')>=0){	
// Get variables in the url
		this.ajaxObjects[ajaxIndex].method='GET';	
// Change method to get
		var string=url.substring(url.indexOf('?'));	
// Extract get variables
		url=url.replace(string,'');
		string=string.replace('?','');
		var items=string.split(/&/g);
		for(var no=0;no<items.length;no++){
		var tokens=items[no].split('=');
		if(tokens.length==2){
			this.ajaxObjects[ajaxIndex].setVar(tokens[0],tokens[1]);
		}
		}
		url=url.replace(string,'');
	}

	this.ajaxObjects[ajaxIndex].requestFile=url;	
// Specifying which file to get
	this.ajaxObjects[ajaxIndex].onCompletion=function(){ DHTMLSuite.variableStorage.arrayDSObjects[ind].__ajax_showContent(divId,ajaxIndex,url,functionToCallOnLoaded); };	
// Specify function that will be executed after file has been found
	this.ajaxObjects[ajaxIndex].onError=function(){ DHTMLSuite.variableStorage.arrayDSObjects[ind].__ajax_displayError(divId,ajaxIndex,url,functionToCallOnLoaded); };	
// Specify function that will be executed after file has been found
	this.ajaxObjects[ajaxIndex].runAJAX();	
// Execute AJAX function
	}
	
// }}}
	,
	
// {{{ setWaitMessage()
	/**
	*Specify which message to show when Ajax is busy.
	 *
	*@param String newWaitMessage=New wait message (Default="Loading content-please wait")- use false if you don't want any wait message
	 *
	*@public
	 */
	setWaitMessage:function(newWaitMessage){
	this.waitMessage=newWaitMessage;
	}
	
// }}}
	,
	
// {{{ setWaitImage()
	/**
	*Specify an image to show when Ajax is busy working.
	 *
	*@param String newWaitImage=New wait image ( default=ajax-loader-blue.gif-it is by default located inside the image_dhtmlsuite folder.-If you like a new image, try to generate one at http:
//www.ajaxload.info/
	 *
	*@public
	 */
	setWaitImage:function(newWaitImage){
	this.waitImage=newWaitImage;
	}
	
// }}}
	,
	
// {{{ setCache()
	/**
	*Cancel selection when drag is in process
	 *
	*@param Boolean enableCache=true if you want to enable cache, false otherwise(default is true). You can also send HTMl code in here, example an &lt;img> tag.
	 *
	*@public
	 */
	setCache:function(enableCache){
	this.enableCache=enableCache;
	}
	
// }}}
	,
	
// {{{ __ajax_showContent()
	/**
	*Evaluate Javascript in the inserted content
	 *
	*@private
	 */
	__ajax_showContent :function(divId,ajaxIndex,url,functionToCallOnLoaded){
	document.getElementById(divId).innerHTML='';
	document.getElementById(divId).innerHTML=this.ajaxObjects[ajaxIndex].response;
	if(this.enableCache){	
// Cache is enabled
		this.jsCache[url]=document.getElementById(divId).innerHTML+'';	
// Put content into cache
	}
	DHTMLSuite.commonObj.__evaluateJs(divId);	
// Call private method which evaluates JS content
	DHTMLSuite.commonObj.__evaluateCss(divId);	
// Call private method which evaluates JS content
	if(functionToCallOnLoaded)eval(functionToCallOnLoaded);
	this.ajaxObjects[ajaxIndex]=null;	
// Clear sack object
	return false;
	}
	
// }}}
	,
	
// {{{ __ajax_displayError()
	/**
	*Display error message when the request failed.
	 *
	*@private
	 */
	__ajax_displayError:function(divId,ajaxIndex,url,functionToCallOnLoaded){
	document.getElementById(divId).innerHTML='<h2>Message from DHTMLSuite.dynamicContent</h2><p>The ajax request for '+url+' failed</p>';
	}
	
// }}}
};





// Creating global variable of this class
DHTMLSuite.ajax=new DHTMLSuite.ajaxUtil();
