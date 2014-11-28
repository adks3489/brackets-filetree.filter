/*global define, $, brackets, window */
define(function (require, exports, module) {
  "use strict";
  var ProjectManager = brackets.getModule("project/ProjectManager");
  var CommandManager = brackets.getModule("command/CommandManager"),
      Menus          = brackets.getModule("command/Menus"),
      AppInit        = brackets.getModule("utils/AppInit");
  var PreferencesManager = brackets.getModule("preferences/PreferencesManager"),
      Dialogs = brackets.getModule("widgets/Dialogs"),
      prefs = PreferencesManager.getExtensionPrefs("brackets-filetree.filter");
  var optionsTemplate = require("text!options.html");
  prefs.definePreference("exthidelist", "string", "");

  function filterFile(){
    $("li.jstree-leaf").each(function(){
      try{
        var ext = $(this).find("span.extension").text();
        var exthide = prefs.get("exthidelist").replace(/ |\n/g, '');
        var exthidelist = exthide.split(",");
        if(exthidelist.indexOf(ext)!=-1){
          $(this).hide();
        }
        else{
          $(this).show();
        }
      }
      catch(ex){
        console.error("filterFile Error: "+ex);
      }      
    });
  }
  $(ProjectManager).on("projectOpen", filterFile);
  
  function showPreferences(){
    var dialog = Dialogs.showModalDialogUsingTemplate(optionsTemplate);
    //Load setting to dialog
    $("#extfilter").text(prefs.get("exthidelist"));
    
    dialog.done(function (buttonId) {
      if (buttonId === "ok") {
        var $dialog = dialog.getElement();
        prefs.set("exthidelist", $("#extfilter", $dialog).val());
        filterFile();
      }
    });
  }
  
  AppInit.appReady(function(){
    var FILETREE_FILTER = "filetree.filter";
    CommandManager.register("Filter FileTree Setting", FILETREE_FILTER, showPreferences);    
    var menu = Menus.getMenu(Menus.AppMenuBar.VIEW_MENU);
    menu.addMenuItem(FILETREE_FILTER);
  });
});