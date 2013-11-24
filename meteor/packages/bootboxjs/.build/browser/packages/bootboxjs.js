(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/bootboxjs/lib/bootbox.js                                                                       //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
/**                                                                                                        // 1
 * bootbox.js v4.0.0                                                                                       // 2
 *                                                                                                         // 3
 * http://bootboxjs.com/license.txt                                                                        // 4
 */                                                                                                        // 5
// @see https://github.com/makeusabrew/bootbox/issues/71                                                   // 6
window.bootbox = window.bootbox || (function init($, undefined) {                                          // 7
  "use strict";                                                                                            // 8
                                                                                                           // 9
  // the base DOM structure needed to create a modal                                                       // 10
  var templates = {                                                                                        // 11
    dialog:                                                                                                // 12
      "<div class='bootbox modal' tabindex='-1' role='dialog'>" +                                          // 13
        "<div class='modal-dialog'>" +                                                                     // 14
          "<div class='modal-content'>" +                                                                  // 15
            "<div class='modal-body'><div class='bootbox-body'></div></div>" +                             // 16
          "</div>" +                                                                                       // 17
        "</div>" +                                                                                         // 18
      "</div>",                                                                                            // 19
    header:                                                                                                // 20
      "<div class='modal-header'>" +                                                                       // 21
        "<h4 class='modal-title'></h4>" +                                                                  // 22
      "</div>",                                                                                            // 23
    footer:                                                                                                // 24
      "<div class='modal-footer'></div>",                                                                  // 25
    closeButton:                                                                                           // 26
      "<button type='button' class='bootbox-close-button close'>&times;</button>",                         // 27
    form:                                                                                                  // 28
      "<form class='bootbox-form'></form>",                                                                // 29
    inputs: {                                                                                              // 30
      text:                                                                                                // 31
        "<input class='bootbox-input form-control' autocomplete=off type=text />"                          // 32
    }                                                                                                      // 33
  };                                                                                                       // 34
                                                                                                           // 35
  // cache a reference to the jQueryfied body element                                                      // 36
  var appendTo = $("body");                                                                                // 37
                                                                                                           // 38
  var defaults = {                                                                                         // 39
    // default language                                                                                    // 40
    locale: "en",                                                                                          // 41
    // show backdrop or not                                                                                // 42
    backdrop: true,                                                                                        // 43
    // animate the modal in/out                                                                            // 44
    animate: true,                                                                                         // 45
    // additional class string applied to the top level dialog                                             // 46
    className: null,                                                                                       // 47
    // whether or not to include a close button                                                            // 48
    closeButton: true,                                                                                     // 49
    // show the dialog immediately by default                                                              // 50
    show: true                                                                                             // 51
  };                                                                                                       // 52
                                                                                                           // 53
  // our public object; augmented after our private API                                                    // 54
  var exports = {};                                                                                        // 55
                                                                                                           // 56
  /**                                                                                                      // 57
   * @private                                                                                              // 58
   */                                                                                                      // 59
  function _t(key) {                                                                                       // 60
    var locale = locales[defaults.locale];                                                                 // 61
    return locale ? locale[key] : locales.en[key];                                                         // 62
  }                                                                                                        // 63
                                                                                                           // 64
  function processCallback(e, dialog, callback) {                                                          // 65
    e.preventDefault();                                                                                    // 66
                                                                                                           // 67
    // by default we assume a callback will get rid of the dialog,                                         // 68
    // although it is given the opportunity to override this                                               // 69
                                                                                                           // 70
    // so, if the callback can be invoked and it *explicitly returns false*                                // 71
    // then we'll set a flag to keep the dialog active...                                                  // 72
    var preserveDialog = $.isFunction(callback) && callback(e) === false;                                  // 73
                                                                                                           // 74
    // ... otherwise we'll bin it                                                                          // 75
    if (!preserveDialog) {                                                                                 // 76
      dialog.modal("hide");                                                                                // 77
    }                                                                                                      // 78
  }                                                                                                        // 79
                                                                                                           // 80
  function getKeyLength(obj) {                                                                             // 81
    // @TODO defer to Object.keys(x).length if available?                                                  // 82
    var k, t = 0;                                                                                          // 83
    for (k in obj) {                                                                                       // 84
      t ++;                                                                                                // 85
    }                                                                                                      // 86
    return t;                                                                                              // 87
  }                                                                                                        // 88
                                                                                                           // 89
  function each(collection, iterator) {                                                                    // 90
    var index = 0;                                                                                         // 91
    $.each(collection, function(key, value) {                                                              // 92
      iterator(key, value, index++);                                                                       // 93
    });                                                                                                    // 94
  }                                                                                                        // 95
                                                                                                           // 96
  function sanitize(options) {                                                                             // 97
    var buttons;                                                                                           // 98
    var total;                                                                                             // 99
                                                                                                           // 100
                                                                                                           // 101
    if (typeof options !== "object") {                                                                     // 102
      throw new Error("Please supply an object of options");                                               // 103
    }                                                                                                      // 104
                                                                                                           // 105
    if (!options.message) {                                                                                // 106
      throw new Error("Please specify a message");                                                         // 107
    }                                                                                                      // 108
                                                                                                           // 109
    // make sure any supplied options take precedence over defaults                                        // 110
    options = $.extend({}, defaults, options);                                                             // 111
                                                                                                           // 112
    if (!options.buttons) {                                                                                // 113
      options.buttons = {};                                                                                // 114
    }                                                                                                      // 115
                                                                                                           // 116
    // we only support Bootstrap's "static" and false backdrop args                                        // 117
    // supporting true would mean you could dismiss the dialog without                                     // 118
    // explicitly interacting with it                                                                      // 119
    options.backdrop = options.backdrop ? "static" : false;                                                // 120
                                                                                                           // 121
    buttons = options.buttons;                                                                             // 122
                                                                                                           // 123
    total = getKeyLength(buttons);                                                                         // 124
                                                                                                           // 125
    each(buttons, function(key, button, index) {                                                           // 126
                                                                                                           // 127
      if ($.isFunction(button)) {                                                                          // 128
        // short form, assume value is our callback. Since button                                          // 129
        // isn't an object it isn't a reference either so re-assign it                                     // 130
        button = buttons[key] = {                                                                          // 131
          callback: button                                                                                 // 132
        };                                                                                                 // 133
      }                                                                                                    // 134
                                                                                                           // 135
      // before any further checks make sure by now button is the correct type                             // 136
      if ($.type(button) !== "object") {                                                                   // 137
        throw new Error("button with key " + key + " must be an object");                                  // 138
      }                                                                                                    // 139
                                                                                                           // 140
      if (!button.label) {                                                                                 // 141
        // the lack of an explicit label means we'll assume the key is good enough                         // 142
        button.label = key;                                                                                // 143
      }                                                                                                    // 144
                                                                                                           // 145
      if (!button.className) {                                                                             // 146
        if (total <= 2 && index === total-1) {                                                             // 147
          // always add a primary to the main option in a two-button dialog                                // 148
          button.className = "btn-primary";                                                                // 149
        } else {                                                                                           // 150
          button.className = "btn-default";                                                                // 151
        }                                                                                                  // 152
      }                                                                                                    // 153
    });                                                                                                    // 154
                                                                                                           // 155
    return options;                                                                                        // 156
  }                                                                                                        // 157
                                                                                                           // 158
  function mapArguments(args, properties) {                                                                // 159
    var argn = args.length;                                                                                // 160
    var options = {};                                                                                      // 161
                                                                                                           // 162
    if (argn < 1 || argn > 2) {                                                                            // 163
      throw new Error("Invalid argument length");                                                          // 164
    }                                                                                                      // 165
                                                                                                           // 166
    if (argn === 2 || typeof args[0] === "string") {                                                       // 167
      options[properties[0]] = args[0];                                                                    // 168
      options[properties[1]] = args[1];                                                                    // 169
    } else {                                                                                               // 170
      options = args[0];                                                                                   // 171
    }                                                                                                      // 172
                                                                                                           // 173
    return options;                                                                                        // 174
  }                                                                                                        // 175
                                                                                                           // 176
  function mergeArguments(defaults, args, properties) {                                                    // 177
    return $.extend(true, {}, defaults, mapArguments(args, properties));                                   // 178
  }                                                                                                        // 179
                                                                                                           // 180
  function mergeButtons(labels, args, properties) {                                                        // 181
    return validateButtons(                                                                                // 182
      mergeArguments(createButtons.apply(null, labels), args, properties),                                 // 183
      labels                                                                                               // 184
    );                                                                                                     // 185
  }                                                                                                        // 186
                                                                                                           // 187
  function createLabels() {                                                                                // 188
    var buttons = {};                                                                                      // 189
                                                                                                           // 190
    for (var i = 0, j = arguments.length; i < j; i++) {                                                    // 191
      var argument = arguments[i];                                                                         // 192
      var key = argument.toLowerCase();                                                                    // 193
      var value = argument.toUpperCase();                                                                  // 194
                                                                                                           // 195
      buttons[key] = {                                                                                     // 196
        label: _t(value)                                                                                   // 197
      };                                                                                                   // 198
    }                                                                                                      // 199
                                                                                                           // 200
    return buttons;                                                                                        // 201
  }                                                                                                        // 202
                                                                                                           // 203
  function createButtons() {                                                                               // 204
    return {                                                                                               // 205
      buttons: createLabels.apply(null, arguments)                                                         // 206
    };                                                                                                     // 207
  }                                                                                                        // 208
                                                                                                           // 209
  function validateButtons(options, buttons) {                                                             // 210
    var allowedButtons = {};                                                                               // 211
    each(buttons, function(key, value) {                                                                   // 212
      allowedButtons[value] = true;                                                                        // 213
    });                                                                                                    // 214
                                                                                                           // 215
    each(options.buttons, function(key) {                                                                  // 216
      if (allowedButtons[key] === undefined) {                                                             // 217
        throw new Error("button key " + key + " is not allowed (options are " + buttons.join("\n") + ")"); // 218
      }                                                                                                    // 219
    });                                                                                                    // 220
                                                                                                           // 221
    return options;                                                                                        // 222
  }                                                                                                        // 223
                                                                                                           // 224
  exports.alert = function() {                                                                             // 225
    var options;                                                                                           // 226
                                                                                                           // 227
    options = mergeButtons(["ok"], arguments, ["message", "callback"]);                                    // 228
                                                                                                           // 229
    if (options.callback && !$.isFunction(options.callback)) {                                             // 230
      throw new Error("alert requires callback property to be a function when provided");                  // 231
    }                                                                                                      // 232
                                                                                                           // 233
    /**                                                                                                    // 234
     * overrides                                                                                           // 235
     */                                                                                                    // 236
    options.buttons.ok.callback = options.onEscape = function() {                                          // 237
      if ($.isFunction(options.callback)) {                                                                // 238
        return options.callback();                                                                         // 239
      }                                                                                                    // 240
      return true;                                                                                         // 241
    };                                                                                                     // 242
                                                                                                           // 243
    return exports.dialog(options);                                                                        // 244
  };                                                                                                       // 245
                                                                                                           // 246
  exports.confirm = function() {                                                                           // 247
    var options;                                                                                           // 248
                                                                                                           // 249
    options = mergeButtons(["cancel", "confirm"], arguments, ["message", "callback"]);                     // 250
                                                                                                           // 251
    /**                                                                                                    // 252
     * overrides; undo anything the user tried to set they shouldn't have                                  // 253
     */                                                                                                    // 254
    options.buttons.cancel.callback = options.onEscape = function() {                                      // 255
      return options.callback(false);                                                                      // 256
    };                                                                                                     // 257
                                                                                                           // 258
    options.buttons.confirm.callback = function() {                                                        // 259
      return options.callback(true);                                                                       // 260
    };                                                                                                     // 261
                                                                                                           // 262
    // confirm specific validation                                                                         // 263
    if (!$.isFunction(options.callback)) {                                                                 // 264
      throw new Error("confirm requires a callback");                                                      // 265
    }                                                                                                      // 266
                                                                                                           // 267
    return exports.dialog(options);                                                                        // 268
  };                                                                                                       // 269
                                                                                                           // 270
  exports.prompt = function() {                                                                            // 271
    var options;                                                                                           // 272
    var defaults;                                                                                          // 273
    var dialog;                                                                                            // 274
    var form;                                                                                              // 275
    var input;                                                                                             // 276
    var shouldShow;                                                                                        // 277
                                                                                                           // 278
    // we have to create our form first otherwise                                                          // 279
    // its value is undefined when gearing up our options                                                  // 280
    // @TODO this could be solved by allowing message to                                                   // 281
    // be a function instead...                                                                            // 282
    form = $(templates.form);                                                                              // 283
                                                                                                           // 284
    defaults = {                                                                                           // 285
      buttons: createLabels("cancel", "confirm"),                                                          // 286
      value: ""                                                                                            // 287
    };                                                                                                     // 288
                                                                                                           // 289
    options = validateButtons(                                                                             // 290
      mergeArguments(defaults, arguments, ["title", "callback"]),                                          // 291
      ["cancel", "confirm"]                                                                                // 292
    );                                                                                                     // 293
                                                                                                           // 294
    // capture the user's show value; we always set this to false before                                   // 295
    // spawning the dialog to give us a chance to attach some handlers to                                  // 296
    // it, but we need to make sure we respect a preference not to show it                                 // 297
    shouldShow = (options.show === undefined) ? true : options.show;                                       // 298
                                                                                                           // 299
    /**                                                                                                    // 300
     * overrides; undo anything the user tried to set they shouldn't have                                  // 301
     */                                                                                                    // 302
    options.message = form;                                                                                // 303
                                                                                                           // 304
    options.buttons.cancel.callback = options.onEscape = function() {                                      // 305
      return options.callback(null);                                                                       // 306
    };                                                                                                     // 307
                                                                                                           // 308
    options.buttons.confirm.callback = function() {                                                        // 309
      return options.callback(input.val());                                                                // 310
    };                                                                                                     // 311
                                                                                                           // 312
    options.show = false;                                                                                  // 313
                                                                                                           // 314
    // prompt specific validation                                                                          // 315
    if (!options.title) {                                                                                  // 316
      throw new Error("prompt requires a title");                                                          // 317
    }                                                                                                      // 318
                                                                                                           // 319
    if (!$.isFunction(options.callback)) {                                                                 // 320
      throw new Error("prompt requires a callback");                                                       // 321
    }                                                                                                      // 322
                                                                                                           // 323
    // create the input                                                                                    // 324
    input = $(templates.inputs.text);                                                                      // 325
    input.val(options.value);                                                                              // 326
                                                                                                           // 327
    // now place it in our form                                                                            // 328
    form.append(input);                                                                                    // 329
                                                                                                           // 330
    form.on("submit", function(e) {                                                                        // 331
      e.preventDefault();                                                                                  // 332
      // @TODO can we actually click *the* button object instead?                                          // 333
      // e.g. buttons.confirm.click() or similar                                                           // 334
      dialog.find(".btn-primary").click();                                                                 // 335
    });                                                                                                    // 336
                                                                                                           // 337
    dialog = exports.dialog(options);                                                                      // 338
                                                                                                           // 339
    // clear the existing handler focusing the submit button...                                            // 340
    dialog.off("shown.bs.modal");                                                                          // 341
                                                                                                           // 342
    // ...and replace it with one focusing our input, if possible                                          // 343
    dialog.on("shown.bs.modal", function() {                                                               // 344
      input.focus();                                                                                       // 345
    });                                                                                                    // 346
                                                                                                           // 347
    if (shouldShow === true) {                                                                             // 348
      dialog.modal("show");                                                                                // 349
    }                                                                                                      // 350
                                                                                                           // 351
    return dialog;                                                                                         // 352
  };                                                                                                       // 353
                                                                                                           // 354
  exports.dialog = function(options) {                                                                     // 355
    options = sanitize(options);                                                                           // 356
                                                                                                           // 357
    var dialog = $(templates.dialog);                                                                      // 358
    var body = dialog.find(".modal-body");                                                                 // 359
    var buttons = options.buttons;                                                                         // 360
    var buttonStr = "";                                                                                    // 361
    var callbacks = {                                                                                      // 362
      onEscape: options.onEscape                                                                           // 363
    };                                                                                                     // 364
                                                                                                           // 365
    each(buttons, function(key, button) {                                                                  // 366
                                                                                                           // 367
      // @TODO I don't like this string appending to itself; bit dirty. Needs reworking                    // 368
      // can we just build up button elements instead? slower but neater. Then button                      // 369
      // can just become a template too                                                                    // 370
      buttonStr += "<button data-bb-handler='" + key + "' type='button' class='btn " + button.className + "'>" + button.label + "</button>";
      callbacks[key] = button.callback;                                                                    // 372
    });                                                                                                    // 373
                                                                                                           // 374
    body.find(".bootbox-body").html(options.message);                                                      // 375
                                                                                                           // 376
    if (options.animate === true) {                                                                        // 377
      dialog.addClass("fade");                                                                             // 378
    }                                                                                                      // 379
                                                                                                           // 380
    if (options.className) {                                                                               // 381
      dialog.addClass(options.className);                                                                  // 382
    }                                                                                                      // 383
                                                                                                           // 384
    if (options.title) {                                                                                   // 385
      body.before(templates.header);                                                                       // 386
    }                                                                                                      // 387
                                                                                                           // 388
    if (options.closeButton) {                                                                             // 389
      var closeButton = $(templates.closeButton);                                                          // 390
                                                                                                           // 391
      if (options.title) {                                                                                 // 392
        dialog.find(".modal-header").prepend(closeButton);                                                 // 393
      } else {                                                                                             // 394
        closeButton.css("margin-top", "-10px").prependTo(body);                                            // 395
      }                                                                                                    // 396
    }                                                                                                      // 397
                                                                                                           // 398
    if (options.title) {                                                                                   // 399
      dialog.find(".modal-title").html(options.title);                                                     // 400
    }                                                                                                      // 401
                                                                                                           // 402
    if (buttonStr.length) {                                                                                // 403
      body.after(templates.footer);                                                                        // 404
      dialog.find(".modal-footer").html(buttonStr);                                                        // 405
    }                                                                                                      // 406
                                                                                                           // 407
                                                                                                           // 408
    /**                                                                                                    // 409
     * Bootstrap event listeners; used handle extra                                                        // 410
     * setup & teardown required after the underlying                                                      // 411
     * modal has performed certain actions                                                                 // 412
     */                                                                                                    // 413
                                                                                                           // 414
    dialog.on("hidden.bs.modal", function(e) {                                                             // 415
      // ensure we don't accidentally intercept hidden events triggered                                    // 416
      // by children of the current dialog. We shouldn't anymore now BS                                    // 417
      // namespaces its events; but still worth doing                                                      // 418
      if (e.target === this) {                                                                             // 419
        dialog.remove();                                                                                   // 420
      }                                                                                                    // 421
    });                                                                                                    // 422
                                                                                                           // 423
    /*                                                                                                     // 424
    dialog.on("show.bs.modal", function() {                                                                // 425
      // sadly this doesn't work; show is called *just* before                                             // 426
      // the backdrop is added so we'd need a setTimeout hack or                                           // 427
      // otherwise... leaving in as would be nice                                                          // 428
      if (options.backdrop) {                                                                              // 429
        dialog.next(".modal-backdrop").addClass("bootbox-backdrop");                                       // 430
      }                                                                                                    // 431
    });                                                                                                    // 432
    */                                                                                                     // 433
                                                                                                           // 434
    dialog.on("shown.bs.modal", function() {                                                               // 435
      dialog.find(".btn-primary:first").focus();                                                           // 436
    });                                                                                                    // 437
                                                                                                           // 438
    /**                                                                                                    // 439
     * Bootbox event listeners; experimental and may not last                                              // 440
     * just an attempt to decouple some behaviours from their                                              // 441
     * respective triggers                                                                                 // 442
     */                                                                                                    // 443
                                                                                                           // 444
    dialog.on("escape.close.bb", function(e) {                                                             // 445
      if (callbacks.onEscape) {                                                                            // 446
        processCallback(e, dialog, callbacks.onEscape);                                                    // 447
      }                                                                                                    // 448
    });                                                                                                    // 449
                                                                                                           // 450
    /**                                                                                                    // 451
     * Standard jQuery event listeners; used to handle user                                                // 452
     * interaction with our dialog                                                                         // 453
     */                                                                                                    // 454
                                                                                                           // 455
    dialog.on("click", ".modal-footer button", function(e) {                                               // 456
      var callbackKey = $(this).data("bb-handler");                                                        // 457
                                                                                                           // 458
      processCallback(e, dialog, callbacks[callbackKey]);                                                  // 459
                                                                                                           // 460
    });                                                                                                    // 461
                                                                                                           // 462
    dialog.on("click", ".bootbox-close-button", function(e) {                                              // 463
      // onEscape might be falsy but that's fine; the fact is                                              // 464
      // if the user has managed to click the close button we                                              // 465
      // have to close the dialog, callback or not                                                         // 466
      processCallback(e, dialog, callbacks.onEscape);                                                      // 467
    });                                                                                                    // 468
                                                                                                           // 469
    dialog.on("keyup", function(e) {                                                                       // 470
      if (e.which === 27) {                                                                                // 471
        dialog.trigger("escape.close.bb");                                                                 // 472
      }                                                                                                    // 473
    });                                                                                                    // 474
                                                                                                           // 475
    // the remainder of this method simply deals with adding our                                           // 476
    // dialogent to the DOM, augmenting it with Bootstrap's modal                                          // 477
    // functionality and then giving the resulting object back                                             // 478
    // to our caller                                                                                       // 479
                                                                                                           // 480
    appendTo.append(dialog);                                                                               // 481
                                                                                                           // 482
    dialog.modal({                                                                                         // 483
      backdrop: options.backdrop,                                                                          // 484
      keyboard: false,                                                                                     // 485
      show: false                                                                                          // 486
    });                                                                                                    // 487
                                                                                                           // 488
    if (options.show) {                                                                                    // 489
      dialog.modal("show");                                                                                // 490
    }                                                                                                      // 491
                                                                                                           // 492
    // @TODO should we return the raw element here or should                                               // 493
    // we wrap it in an object on which we can expose some neater                                          // 494
    // methods, e.g. var d = bootbox.alert(); d.hide(); instead                                            // 495
    // of d.modal("hide");                                                                                 // 496
                                                                                                           // 497
   /*                                                                                                      // 498
    function BBDialog(elem) {                                                                              // 499
      this.elem = elem;                                                                                    // 500
    }                                                                                                      // 501
                                                                                                           // 502
    BBDialog.prototype = {                                                                                 // 503
      hide: function() {                                                                                   // 504
        return this.elem.modal("hide");                                                                    // 505
      },                                                                                                   // 506
      show: function() {                                                                                   // 507
        return this.elem.modal("show");                                                                    // 508
      }                                                                                                    // 509
    };                                                                                                     // 510
    */                                                                                                     // 511
                                                                                                           // 512
    return dialog;                                                                                         // 513
                                                                                                           // 514
  };                                                                                                       // 515
                                                                                                           // 516
  exports.setDefaults = function(values) {                                                                 // 517
    $.extend(defaults, values);                                                                            // 518
  };                                                                                                       // 519
                                                                                                           // 520
  exports.hideAll = function() {                                                                           // 521
    $(".bootbox").modal("hide");                                                                           // 522
  };                                                                                                       // 523
                                                                                                           // 524
                                                                                                           // 525
  /**                                                                                                      // 526
   * standard locales. Please add more according to ISO 639-1 standard. Multiple language variants are     // 527
   * unlikely to be required. If this gets too large it can be split out into separate JS files.           // 528
   */                                                                                                      // 529
  var locales = {                                                                                          // 530
    br : {                                                                                                 // 531
      OK      : "OK",                                                                                      // 532
      CANCEL  : "Cancelar",                                                                                // 533
      CONFIRM : "Sim"                                                                                      // 534
    },                                                                                                     // 535
    da : {                                                                                                 // 536
      OK      : "OK",                                                                                      // 537
      CANCEL  : "Annuller",                                                                                // 538
      CONFIRM : "Accepter"                                                                                 // 539
    },                                                                                                     // 540
    de : {                                                                                                 // 541
      OK      : "OK",                                                                                      // 542
      CANCEL  : "Abbrechen",                                                                               // 543
      CONFIRM : "Akzeptieren"                                                                              // 544
    },                                                                                                     // 545
    en : {                                                                                                 // 546
      OK      : "OK",                                                                                      // 547
      CANCEL  : "Cancel",                                                                                  // 548
      CONFIRM : "OK"                                                                                       // 549
    },                                                                                                     // 550
    es : {                                                                                                 // 551
      OK      : "OK",                                                                                      // 552
      CANCEL  : "Cancelar",                                                                                // 553
      CONFIRM : "Aceptar"                                                                                  // 554
    },                                                                                                     // 555
    fi : {                                                                                                 // 556
      OK      : "OK",                                                                                      // 557
      CANCEL  : "Peruuta",                                                                                 // 558
      CONFIRM : "OK"                                                                                       // 559
    },                                                                                                     // 560
    fr : {                                                                                                 // 561
      OK      : "OK",                                                                                      // 562
      CANCEL  : "Annuler",                                                                                 // 563
      CONFIRM : "D'accord"                                                                                 // 564
    },                                                                                                     // 565
    it : {                                                                                                 // 566
      OK      : "OK",                                                                                      // 567
      CANCEL  : "Annulla",                                                                                 // 568
      CONFIRM : "Conferma"                                                                                 // 569
    },                                                                                                     // 570
    nl : {                                                                                                 // 571
      OK      : "OK",                                                                                      // 572
      CANCEL  : "Annuleren",                                                                               // 573
      CONFIRM : "Accepteren"                                                                               // 574
    },                                                                                                     // 575
    pl : {                                                                                                 // 576
      OK      : "OK",                                                                                      // 577
      CANCEL  : "Anuluj",                                                                                  // 578
      CONFIRM : "Potwierdź"                                                                                // 579
    },                                                                                                     // 580
    ru : {                                                                                                 // 581
      OK      : "OK",                                                                                      // 582
      CANCEL  : "Отмена",                                                                                  // 583
      CONFIRM : "Применить"                                                                                // 584
    },                                                                                                     // 585
    zh_CN : {                                                                                              // 586
      OK      : "OK",                                                                                      // 587
      CANCEL  : "取消",                                                                                      // 588
      CONFIRM : "确认"                                                                                       // 589
    },                                                                                                     // 590
    zh_TW : {                                                                                              // 591
      OK      : "OK",                                                                                      // 592
      CANCEL  : "取消",                                                                                      // 593
      CONFIRM : "確認"                                                                                       // 594
    }                                                                                                      // 595
  };                                                                                                       // 596
                                                                                                           // 597
  exports.init = function(_$) {                                                                            // 598
    window.bootbox = init(_$ || $);                                                                        // 599
  };                                                                                                       // 600
                                                                                                           // 601
  return exports;                                                                                          // 602
                                                                                                           // 603
}(window.jQuery));                                                                                         // 604
                                                                                                           // 605
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);
