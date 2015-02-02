YUI.add('image-preload', function (Y) {
    var Lang = Y.Lang;
    getCN = Y.ClassNameManager.getClassName;
    function ImagePreload(config) {
        ImagePreload.superclass.constructor.apply(this, arguments);
    }
    ImagePreload.ATTRS = {
        nodeMainScroll: {
            value: Y.one('body,html')
        }
    };
    ImagePreload.NAME = 'image-preload';
    ImagePreload.prototype = {
        initializer: function () {
            var
                nodeMainScroll = this.get('nodeMainScroll')
                ;
            this._vtbl = {
                images: Y.all('img.preload'),
                selectorRepeatTimer: null,
                clientHeight: parseInt(Y.one('body').get('clientHeight'))
            };
        },
        bindUI: function () {
            Y.one('window').on('scroll', this._onWindowScroll, this);
        },
        unBindUI: function() {
            Y.one('window').detach('scroll');
        },
        renderUI: function () {
            this._vtbl.images.each(function(el) {
                var
                    xy = el.getXY()
                    ;
                el.setAttribute('data-y', xy[1]);
            });
            this.loadImagesIntoViewPort();
        },
        _onWindowScroll: function() {
            var
                self = this
                ;
            if (this._vtbl.images.size() > 0) {
                clearTimeout(this._vtbl.selectorTimer);
                this.loadImagesIntoViewPort();
                this._vtbl.selectorTimer = window.setTimeout(function(){self.repeatCreateImageList.call(self);}, 2000);
            }
        },
        repeatCreateImageList: function() {
            this._vtbl.images = Y.all('img.preload');
        },
        reInit: function() {
            this.unBindUI();
            this.initializer();
            this.bindUI();
            this.renderUI();
        },
        clearImageList: function() {
            this._vtbl.images = new Y.NodeList([]);
        },
        loadImagesIntoViewPort: function() {
            var
                self = this,
                is_image_preload_exists = false,
                nodeMainScroll = this.get('nodeMainScroll'),
                scrollTop = parseInt(Y.one('html').get('scrollTop') ? Y.one('html').get('scrollTop') : Y.one('body').get('scrollTop'))
                ;
            this._vtbl.images.each(function (el) {
                if (el.hasClass('preload') && el.hasAttribute('data-src')) {
                    is_image_preload_exists = true;
                    var
                        src = el.getAttribute('data-src'),
                        y = parseInt(el.getAttribute('data-y'))
                        ;
                    if ((y > scrollTop) && y < (scrollTop + self._vtbl.clientHeight * 2)) {
                        el.setAttribute('src', src);
                        el.removeClass('preload');
                    }
                }
            });
            if (!is_image_preload_exists) {
                this.unBindUI();
                this.clearImageList();
            }
        },
        _vtbl: null
    };
    Y.namespace('MyApp').ImagePreload = Y.extend(ImagePreload, Y.Widget, ImagePreload.prototype);
}, '0.1.0', {requires: ['widget']});