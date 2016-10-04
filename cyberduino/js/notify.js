var notify = (function(){
    // From https://gomakethings.com/vanilla-javascript-version-of-jquery-extend/
    var extend = function () {

    // Variables
    var extended = {};
    var deep = false;
    var i = 0;
    var length = arguments.length;

    // Check if a deep merge
    if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
        deep = arguments[0];
        i++;
    }

    // Merge the object into the extended object
    var merge = function (obj) {
        for ( var prop in obj ) {
            if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
                // If deep merge and property is an object, merge properties
                if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
                    extended[prop] = extend( true, extended[prop], obj[prop] );
                } else {
                    extended[prop] = obj[prop];
                }
            }
        }
    };

    // Loop through each object and conduct a merge
    for ( ; i < length; i++ ) {
        var obj = arguments[i];
        merge(obj);
    }

    return extended;

};

    var Type = {
        unknown: 0,
        notify: 1,
        info: 2,
        success: 3,
        warning: 4,
        error: 5
    };

    var positionOption = {
        topLeft: 'topLeft',
        topRight: 'topRight',
        bottomLeft: 'bottomLeft',
        bottomRight: 'bottomRight'
    };

    var DefaultOptions = {
        fadeInDuration: 2000,
        fadeOutDuration: 2000,
        fadeInterval: 50,
        visibleDuration: 50000,
        postHoverVisibleDuration: 500,
        position: positionOption.topRight,
        sticky: true,
        showClose: true,
        title: '',
        text: 'You obviously failed to pass a text to the notification. You are a failure and disgrace...'
    };

    function open(type, text, userOptions){
        var options = extend(DefaultOptions, userOptions);
        options.text = text;

        console.log('Notify: ', type, text, options);
        switch(type){
            case Type.notify:
                vNotify.notify(options);
                break;
            case Type.info:
                vNotify.info(options);
                break;
            case Type.success:
                vNotify.success(options);
                break;
            case Type.warning:
                vNotify.warning(options);
                break;
            case Type.error:
                vNotify.error(options);
                break;
            case Type.unknown:
            default:
                console.error('BAJS!');
                break;
        }
    }

    return {
        notify: function(text, extraOptions) { open(Type.notify, text, extraOptions); },
        info: function(text, extraOptions) { open(Type.info, text, extraOptions); },
        success: function(text, extraOptions) { open(Type.success, text, extraOptions); },
        warning: function(text, extraOptions) { open(Type.warning, text, extraOptions); },
        error: function(text, extraOptions) { open(Type.error, text, extraOptions); },
    }
}());