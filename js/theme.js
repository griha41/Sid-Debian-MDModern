/**
 * Backend for a HTML5 MDM theme.
 * 
 * globals: jQuery mdm
 * 
 * @author  Philipp Miller
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * 
 */
(function($) {
  
  "use strict";
  
  var body           = $(document.body),
      loginForm      = $("#login"),
      usernameInput  = $("#username", loginForm),
      passwordInput  = $("#password", loginForm),
      userlistToggle = $("#userlist-toggle", loginForm),
      faceElem       = $("#face", loginForm),
      usersUl        = $("#users", loginForm),
      users          = [],
      selectedUser,
      countdownElem  = $("#countdown"),
      msgBox         = $("#msg");
  
  // MDM listeners
  mdm.on("userAdded",       addUser)
     .on("userSelected",    selectUser)
     .on("usernamePrompt",  function() { usernameInput.select(); })
     .on("passwordPrompt",  function() { passwordInput.select(); })
     .on("shutdownHidden",  function() { $("#shutdown").hide(); })
     .on("restartHidden",   function() { $("#restart").hide(); })
     .on("suspendHidden",   function() { $("#suspend").hide(); })
     .on("quitHidden",      function() { $("#quit").hide(); })
     .on("loginCountdown",  updateCountdown)
     .on("error",           showMsg);
     // .on("error mdm.message mdm.timedMessage", showMsg);
  
  
  // DOM listeners
  
  // select user by typing in the input field
  usernameInput.on("propertychange input paste", function(evt) {
    selectUser(evt, mdm.getUser(this.value));
  });
  
  loginForm.submit(login);
  
  $("#shutdown a").click(mdm.shutdown);
  $("#restart a").click(mdm.restart);
  $("#suspend a").click(mdm.suspend);
  $("#quit a").click(mdm.quit);
  
  // hide errors and messages by clicking
  msgBox.click(function() { $(this).fadeOut(); });
  
  
  /// FUNCTIONS ///
  
  /**
   * Gather data and give it to mdm for login
   * 
   * @param  {event} evt  form submit event
   */
  function login(evt) {
    evt.preventDefault();
    mdm.login(usernameInput[0].value, passwordInput[0].value);
  }
  
  /**
   * Adds a user to the user list, including
   * image load and event listeners
   * @param  {event} evt   optional mdm event
   * @param  {user}  user  user object
   */
  function addUser(evt, user) {
    var li   = $('<li>'),
        a    = $('<a>' + user.name + '</a>'),
        icon = $('<i class="fa fa-user">'),
        img  = new Image();
    
    usersUl.append(
      li.append(
        a.prepend(icon)
      )
    );
    
    if (user.loggedIn) {
      li.addClass("loggedIn");
    }
    
    a.click(function(evt) {
      selectUser(evt, user);
    });
    
    img.loaded = false;
    img.src = user.home + "/.face";
    $(img).one("load", function() {
      icon.remove();
      a.prepend(img);
      img.loaded = true;
    });
    
    user.li = li;
    user.img = img;
    users.push(user);
    if (users.length === 1) {
      userlistToggle.one("click", toggleUserlist);
    }
    
    if (!selectedUser) {
      selectedUser = user;
    }
  }
  
  /**
   * Set a user as selected for login
   * by passing a user object
   * 
   * @param  {event} evt  mdm or click event
   * @param  {User}  user
   */
  function selectUser(evt, user) {
    selectedUser.li.removeClass("selected");
    updateFace(user);
    
    if (!(user && user.li)) return;
    
    if (!usernameInput.is(evt.target)
      && user.name !== usernameInput[0].value
    ) {
      usernameInput.val(user.name);
    }
    
    if (user.li) {
      user.li.addClass("selected");
    }
    
    selectedUser = user;
  }
  
  /**
   * Sets the face image next to the loginForm
   * if the currently selected user has one.
   * The relevant file is
   * /home/{username}/.face
   * 
   * @param  {User} user   user object
   */
  function updateFace(user) {
    loginForm.removeClass("hasface");
    
    if (!(user && user.img)) return;
    
    if (user.img.loaded) {
      faceElem.attr("src", user.img.src);
      loginForm.addClass("hasface");
    } else {
      $(user.img).one("load", function() {
        if (user == selectedUser)
        faceElem.attr("src", user.img.src);
        loginForm.addClass("hasface");
      });
    }
  }
  
  /**
   * Toggle function for the user selection list.
   * This function recursively listenes to
   * click events either on the toggle anchor (when closed)
   * or on the entire body (when expanded).
   * 
   * @param  {event} evt  click event
   */
  function toggleUserlist(evt) {
    if (!usersUl.expanded) {
      body.click(toggleUserlist);
      evt.stopPropagation();
    }
    else {
      body.off("click", toggleUserlist);
      userlistToggle.one("click", toggleUserlist);
    }
    usersUl.toggleClass("expanded");
    usersUl.expanded = !usersUl.expanded;
  }
  
  /**
   * Make countdown times visible and set time
   * @param  {event} evt   optional
   * @param  {int}   time  time remaining until automatic login
   */
  function updateCountdown(evt, time) {
    countdownElem.text(time);
  }
  
  /**
   * Display a regular message to the user
   * @param  {event}     evt  optional mdm event
   * @param  {string}    msg
   */
  function showMsg(evt, msg) {
    if (!msg) return;
    if (evt.namespace == "error") msgBox.addClass("error");
    else msgBox.removeClass("error");
    
    msgBox
      .html(msg)
      .fadeIn();
  }
  
})(jQuery);
