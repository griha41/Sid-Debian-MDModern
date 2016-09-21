/*! MDModern by Philipp Miller */
 ! function(a, b) {
    "use strict";

    function c(a) {
        alert("LOGIN###" + a), k = !1
    }

    function d(a, b) {
        i.triggerHandler(a, b)
    }

    function e(a, b, c) {
        this.name = a, this.gecos = b, this.loggedIn = !!c, this.home = "file:///home/" + a
    }

    function f(a, b) {
        this.name = a, this.file = b
    }

    function g(a, b) {
        this.name = a, this.code = b
    }
    var h = b.mdm = {},
        i = a(h),
        j = null,
        k = !1,
        l = [],
        m = [],
        n = [];
    h.on = a.fn.on.bind(i), h.one = a.fn.one.bind(i), h.on("passwordPrompt", function() {
        k = !0
    }).on("usernamePrompt", function() {
        k = !1
    }).on("userSelected", function(a, b) {
        j = b.name
    }), h.login = function(a, b, c, d) {
        return c && h.selectSession(c), d && h.selectLanguage(d), h.selectUser(a).sendPassword(b)
    }, h.getUser = function(a) {
        for (var b = 0, c = l.length; c > b; ++b)
            if (l[b].name === "" + a) return l[b]
    }, h.selectUser = function(a) {
        return "string" != typeof a && (a = a.name), a !== j && (k = !1, alert("USER###" + a)), h
    }, h.sendPassword = function(a) {
        return j ? (k ? c(a) : h.one("passwordPrompt", function() {
            c(a)
        }), h) : void 0
    }, h.getSession = function(a) {
        for (var b = 0, c = m.length; c > b; ++b)
            if (m[b].file === "" + a) return m[b]
    }, h.selectSession = function(a) {
        return alert("SESSION###" + a.name + "###" + a.file), d("sessionSelected", a), h
    }, h.getLanguage = function(a) {
        for (var b = 0, c = n.length; c > b; ++b)
            if (n[b].code === "" + a) return n[b]
    }, h.selectLanguage = function(a) {
        return alert("LANGUAGE###" + a.code), d("languageSelected", a), h
    }, h.shutdown = function() {
        return alert("FORCE-SHUTDOWN###"), h
    }, h.restart = function() {
        return alert("FORCE-RESTART###"), h
    }, h.suspend = function() {
        return alert("FORCE-SUSPEND###"), h
    }, h.quit = function() {
        return alert("QUIT###"), h
    }, e.prototype = {
        toString: function() {
            return this.name
        },
        select: function() {
            return h.selectUser(this), this
        }
    }, f.prototype = {
        select: function() {
            return h.selectSession(this), this
        }
    }, g.prototype = {
        select: function() {
            return h.selectLanguage(this), this
        },
        countryCode: function() {
            return this.code.split(".")[0]
        },
        shortCode: function() {
            return this.code.split("_")[0]
        },
        charset: function() {
            return this.code.split(".")[1]
        }
    }, b.mdm_enable = function() {
        d("enabled")
    }, b.mdm_disable = function() {
        d("disabled")
    }, b.mdm_prompt = function() {
        d("usernamePrompt")
    }, b.mdm_noecho = function() {
        d("passwordPrompt")
    }, b.mdm_add_user = function(a, b, c) {
        var f = new e(a, b, c);
        l.push(f), d("userAdded", f)
    }, b.mdm_add_session = function(a, b) {
        var c = new f(a, b);
        m.push(c), d("sessionAdded", c)
    }, b.mdm_add_language = function(a, b) {
        var c = new g(a, b);
        n.push(c), d("languageAdded", c)
    }, b.mdm_set_current_user = function(a) {
        d("userSelected", h.getUser(a) || new e(a))
    }, b.mdm_set_current_session = function(a, b) {
        d("sessionSelected", h.getSession(b))
    }, b.mdm_set_current_language = function(a, b) {
        d("languageSelected", h.getLanguage(b))
    }, b.mdm_error = function(a) {
        d("error", a)
    }, b.mdm_msg = function(a) {
        d("message", a)
    }, b.mdm_timed = function(a) {
        d("timedMessage", a), d("loginCountdown", +a.match(/[0-9]+/)[0])
    }, b.set_welcome_message = function(a) {
        d("welcomeMessage", a)
    }, b.set_clock = function(a) {
        d("clockUpdate", a)
    }, b.mdm_hide_shutdown = function() {
        d("shutdownHidden")
    }, b.mdm_hide_restart = function() {
        d("restartHidden")
    }, b.mdm_hide_suspend = function() {
        d("suspendHidden")
    }, b.mdm_hide_quit = function() {
        d("quitHidden")
    }, b.mdm_hide_xdmcp = function() {
        d("xdmcpHidden")
    }
}(jQuery, window),
function(a, b) {
    "use strict";

    function c(a, b, c) {
        return a in k ? (c || (c = b)) && k[a].addCallback(c) : k[a] = new d(a, b, c), j
    }

    function d(a, c, d) {
        b && b.hasOwnProperty(a) ? (this.parsed = JSON.parse(b.getItem(a)), this.loaded = !0, (d || (d = c)) && d(this.parsed)) : (this.loaded = !1, this.filename = a, this.callbacks = [], d ? (this.parser = e(c), this.callbacks.push(d)) : (this.parser = g, c && this.callbacks.push(c)), this._load())
    }

    function e(a) {
        if ("function" == typeof a) return a;
        switch (a) {
            case "lines":
                return f;
            case "properties":
                return g;
            case "json":
                if (JSON) return JSON.parse;
                break;
            case "plain":
                return function(a) {
                    return a
                }
        }
        throw new Error('Config: Unknown parser "' + a + "'")
    }

    function f(a) {
        return a.split("\n").map(h).filter(i)
    }

    function g(a) {
        var b, c, d = {};
        return a.split("\n").map(h).forEach(function(a, e) {
            if ("" !== a)
                if (c = a.match(/^(\S+)\s*=\s*(.*)$/)) d[c[1]] = JSON ? JSON.parse(c[2]) : c[2];
                else if (c = a.match(/^\[(\S+)\]$/)) b = c[1], d.hasOwnProperty(b) || (d[b] = []);
            else {
                if (!b) throw new Error("Config: Syntax error on line " + (e + 1));
                d[b].push(a)
            }
        }), d
    }

    function h(a) {
        var b = a.indexOf("#");
        return (b >= 0 ? a.slice(0, b) : a).trim()
    }

    function i(a) {
        return a
    }
    var j = a.config = {
            require: c
        },
        k = Object.create(null);
    d.prototype = {
        addCallback: function(a) {
            return this.loaded ? a(this.parsed) : this.callbacks.push(a), this
        },
        _load: function() {
            this.request = new XMLHttpRequest, this.request.open("GET", this.filename), this.request.addEventListener("load", this._loaded.bind(this)), this.request.responseType = "text";
            try {
                this.request.send()
            } catch (a) {}
        },
        _loaded: function() {
            this.loaded = !0, this.parsed = this.parser(this.request.responseText), b && b.setItem(this.filename, JSON.stringify(this.parsed));
            for (var a = 0, c = this.callbacks.length; c > a; ++a) this.callbacks[a](this.parsed);
            delete this.callbacks, delete this.request
        }
    }
}(window, !1),
function(a) {
    "use strict";

    function b(a) {
        a.preventDefault(), mdm.login(l[0].value, m[0].value)
    }

    function c(b, c) {
        var e = a("<li>"),
            g = a("<a>" + c.name + "</a>"),
            h = a('<i class="fa fa-user">'),
            j = new Image;
        p.append(e.append(g.prepend(h))), c.loggedIn && e.addClass("loggedIn"), g.click(function(a) {
            d(a, c)
        }), j.loaded = !1, j.src = c.home + "/.face", a(j).one("load", function() {
            h.remove(), g.prepend(j), j.loaded = !0
        }), c.li = e, c.img = j, q.push(c), 1 === q.length && n.one("click", f), i || (i = c)
    }

    function d(a, b) {
        i.li.removeClass("selected"), e(b), b && b.li && (l.is(a.target) || b.name === l[0].value || l.val(b.name), b.li && b.li.addClass("selected"), i = b)
    }

    function e(b) {
        k.removeClass("hasface"), b && b.img && (b.img.loaded ? (o.attr("src", b.img.src), k.addClass("hasface")) : a(b.img).one("load", function() {
            b == i && o.attr("src", b.img.src), k.addClass("hasface")
        }))
    }

    function f(a) {
        p.expanded ? (j.off("click", f), n.one("click", f)) : (j.click(f), a.stopPropagation()), p.toggleClass("expanded"), p.expanded = !p.expanded
    }

    function g(a, b) {
        r.text(b)
    }

    function h(a, b) {
        b && ("error" == a.namespace ? s.addClass("error") : s.removeClass("error"), s.html(b).fadeIn())
    }
    var i, j = a(document.body),
        k = a("#login"),
        l = a("#username", k),
        m = a("#password", k),
        n = a("#userlist-toggle", k),
        o = a("#face", k),
        p = a("#users", k),
        q = [],
        r = a("#countdown"),
        s = a("#msg");
    mdm.on("userAdded", c).on("userSelected", d).on("usernamePrompt", function() {
        l.select()
    }).on("passwordPrompt", function() {
        m.select()
    }).on("shutdownHidden", function() {
        a("#shutdown").hide()
    }).on("restartHidden", function() {
        a("#restart").hide()
    }).on("suspendHidden", function() {
        a("#suspend").hide()
    }).on("quitHidden", function() {
        a("#quit").hide()
    }).on("loginCountdown", g).on("error", h), l.on("propertychange input paste", function(a) {
        d(a, mdm.getUser(this.value))
    }), k.submit(b), a("#shutdown a").click(mdm.shutdown), a("#restart a").click(mdm.restart), a("#suspend a").click(mdm.suspend), a("#quit a").click(mdm.quit), s.click(function() {
        a(this).fadeOut()
    })
}(jQuery),
function(a) {
    "use strict";

    function b(b, c) {
        c.li = a(document.createElement("li")).append(a("<a>" + c.name + "</a>").click(c.select.bind(c))), f.append(c.li), d || (d = c)
    }

    function c(a, b) {
        d.li.removeClass("selected"), e.html(b.name), b.li.addClass("selected"), d = b
    }
    var d, e = a("#session"),
        f = a("#sessions");
    mdm.on("sessionAdded", b).on("sessionSelected", c)
}(jQuery),
function(a) {
    "use strict";

    function b(b, c) {
        c.li = a(document.createElement("li")).append(a('<a><span class="code">' + c.countryCode() + '</span><span class="name">' + c.name + "</span></a>").click(c.select.bind(c))), f.append(c.li), d || (d = c)
    }

    function c(a, b) {
        d.li.removeClass("selected"), e.html(b.shortCode()), b.li.addClass("selected"), d = b
    }
    var d, e = a("#language"),
        f = a("#languages");
    mdm.on("languageAdded", b).on("languageSelected", c)
}(jQuery),
function(a) {
    "use strict";

    function b(b) {
        return e = a.extend(j, b), f = e.backgrounds, 1 == f.length ? (c(0), void a("#slideshowControls").hide()) : (e.shuffle && i.shuffle(), e.show_filename && (k[0].filenameElem = a(".filename", k[0]), k[1].filenameElem = a(".filename", k[1])), c(0), i.start(), void(e.show_controlls ? (a("#cycleBg").click(i.next), a("#cycleBgBack").click(i.prev), a("#shuffleSlideshow").click(i.shuffle), a("#cycleToggle").click(function() {
            h === !1 ? (i.start(), a(this).children().removeClass("fa-play").addClass("fa-pause")) : (i.stop(), a(this).children().removeClass("fa-pause").addClass("fa-play"))
        })) : a("#slideshowControls").hide()))
    }

    function c(a) {
        g = a, m.src = f[g]
    }

    function d() {
        l = +!l, k[l].hide().css({
            "z-index": 1,
            "background-image": 'url("' + f[g] + '")'
        }), k[+!l].css({
            "z-index": 0
        }), k[l].fadeIn(1e3 * e.fade_seconds), e.show_filename && k[l].filenameElem.text(f[g])
    }
    var e, f, g, h, i = window.slideshow = {},
        j = {
            interval_seconds: 10,
            fade_seconds: 2,
            shuffle: !0,
            show_controlls: !0,
            show_filename: !0
        },
        k = [a("#bg0"), a("#bg1")],
        l = 0,
        m = new Image;
    a(m).on("load", d), config.require("slideshow.conf", b), i.next = function() {
        return c((g + 1) % f.length), i
    }, i.prev = function() {
        return c((g + f.length - 1) % f.length), i
    }, i.start = function() {
        return h = window.setInterval(i.next, 1e3 * e.interval_seconds), i
    }, i.stop = function() {
        return window.clearInterval(h), h = !1, i
    }, i.shuffle = function() {
        for (var a, b, c = f.length; c--;) b = Math.floor(Math.random() * c), a = f[c], f[c] = f[b], f[b] = a;
        return i
    }
}(jQuery),
function(a) {
    "use strict";

    function b(a) {
        d.map(function(b) {
            a.hasOwnProperty(b.key) && b.elems.html(b.val = a[b.key])
        })
    }

    function c(a) {
        var b = {};
        return a.split("\n").forEach(function(a) {
            if (a) {
                var c = a.split("=");
                b[c[0]] = c[1].replace(/"/g, "")
            }
        }), b
    }
    var d = [{
        key: "DISTRIB_ID"
    }, {
        key: "DISTRIB_RELEASE"
    }, {
        key: "DISTRIB_CODENAME"
    }, {
        key: "DISTRIB_DESCRIPTION"
    }];
    d.map(function(b) {
        b.elems = a(".lsb_" + b.key.toLowerCase())
    });
    var e, f;
    for (e = 0, f = d.length; f > e; e++)
        if (d[e].elems.length) {
            config.require("file:///etc/lsb-release", c, b);
            break
        }
}(jQuery);
