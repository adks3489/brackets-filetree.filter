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
  prefs.definePreference("mode", "string", "b");
  prefs.definePreference("exthideList", "string", "");
  prefs.definePreference("extshowList", "string", "");

  function filterFile(){
    var extTarget = "";
    var mode = prefs.get("mode");
    if( mode == "b" ){
      extTarget = prefs.get("exthideList").replace(/ |\n/g, '');
    }
    else{
      extTarget = prefs.get("extshowlist").replace(/ |\n/g, '');
    }

    var extTargetList = extTarget.split(",");
    $("li.jstree-leaf").each(function(){
      try{
        var ext = $(this).find("span.extension").text();
        if(extTargetList.indexOf(ext)!=-1){
          if(mode=="b"){
            $(this).hide();
          }
          else{
            $(this).show();
          }
        }
        else{
          if(mode=="w"){
            $(this).hide();
          }
          else{
            $(this).show();
          }
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
    if(prefs.get("mode")=="w"){
      $("input[name=filtermode]:eq(1)").prop("checked", true);
    }
    else{
      $("input[name=filtermode]:eq(0)").prop("checked", true);
    }
    $("#extblacklist").text(prefs.get("exthideList"));
    $("#extwhitelist").text(prefs.get("extshowlist"));

    dialog.done(function (buttonId) {
      if (buttonId === "ok") {
        var $dialog = dialog.getElement();
        prefs.set("mode", $("input[name=filtermode]:checked", $dialog).val());
        prefs.set("exthideList", $("#extblacklist", $dialog).val());
        prefs.set("extshowlist", $("#extwhitelist", $dialog).val());
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