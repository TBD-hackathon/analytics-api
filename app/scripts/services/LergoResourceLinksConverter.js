'use strict';

/**
 * @ngdoc service
 * @name lergoApp.LergoResourceLinksConverter
 * @description
 * # LergoResourceLinksConverter
 * Service in the lergoApp.
 */
angular.module('lergoApp')
    .service('LergoResourceLinksConverter', function ( $log ) {

        /**
         *
         * @typedef LINK_TYPE
         * @property {string} id
         * @property {string} regex
         * @property {object} replace  used with regexp to replace strings. e.g. : link.replace(new RegExp(type.replace.from), type.replace.to);
         * @property {string} replace.from
         * @property {string} replace.to
         */
        this.LINK_TYPE = {
            
            GOOGLE_DRIVE_1: { 'id' : 'google-drive', 'regex' : 'drive.google.com/file/d/', replace: { from: 'https*://drive.google.com/file/d/(.+)/.*', to: 'https://drive.google.com/thumbnail?id=$1'}},
            GOOGLE_DRIVE_2: { 'id' : 'google-drive', 'regex' : 'drive.google.com/open\\?id=', replace:{ from: 'https*://drive.google.com/open\\?id=(.+)', to: 'https://drive.google.com/uc?export=view&id=$1'}},
            GOOGLE_DRIVE_3: { 'id' : 'google-drive', 'regex' : 'drive.google.com/uc\\?export=view&id=', replace: { from: 'https*://drive.google.com/uc\\?export=view&id=(.+)', to: 'https://drive.google.com/thumbnail?id=$1'}},
            YOUTUBE_1: { 'id' : 'youtube', 'regex' : 'youtu.be/', replace:{ from: '(https://youtu.be/.{11})\\?t=.+', to: '$1'}},
            YOUTUBE_2: { 'id' : 'youtube', 'regex' : 'youtube.com/watch\\?v=.{11}', replace:{ from: '(https://www.youtube.com/watch\\?v=.{11})&.+', to: '$1'}},
            YOUTUBE_3: { 'id' : 'youtube', 'regex' : 'youtube.com/watch\\?time_continue=.{2}&v=.{11}&', replace:{ from: '(https://www.youtube.com/watch\\?)time_continue=.{2}&(v=.{11})&.+', to: '$1$2'}},
            YOUTUBE_4: { 'id' : 'youtube', 'regex' : 'youtube.com/watch\\?time_continue=.{1}&v=.{11}&', replace:{ from: '(https://www.youtube.com/watch\\?)time_continue=.{1}&(v=.{11})&.+', to: '$1$2'}},
            LERGO_1: { 'id' : 'lergo', 'regex' : '.*\/user\/lessons\/.{24}\/intro', replace:{ from: '(.*)\/user\/(lessons\/.{24}\/intro)', to: '$1\/public\/$2'}}
        };
                                                        
        this.getLinkType = function(link){
            return _.find(this.LINK_TYPE, function(t){
                return  new RegExp(t.regex).test(link);

            });
        };

        /**
         *
         * @param {string} link
         * @param {LINK_TYPE} type optional. if not specified will be auto detected from link
         * @returns {string} the converted link
         */
        this.convert = function (link, type) {
            try {
                if ( !type ) { // try to auto detect
                    type = this.getLinkType(link);
                }

                if ( !!type ){ // if auto detected successfully
                    return link.replace(new RegExp(type.replace.from), type.replace.to);
                }

            } catch (e) {
                $log.info('could not convert url [',link,']', e);
            }
            return link;
        };
    });
