﻿exports.create = function() {
    'use strict';

    return new function() {
        var self = this;

        self.AccountUrl = '';
        self.AccountName = '';
        self.AccountKey = '';

        if (isDebugVersion) {
            self.AccountUrl = 'http://dorphoenixtest.blob.core.windows.net/';
            self.AccountName = 'dorphoenixtest';
            self.AccountKey = 'P7YnAD3x84bpwxV0abmguZBXJp7FTCEYj5SYlRPm5BJkf8KzGKEiD1VB1Kv21LGGxbUiLvmVvoChzCprFSWAbg==';
        }

        self.isEmpty = function() {
            return (self.AccountUrl === null || self.AccountUrl === '') &&
            (self.AccountName === null || self.AccountName === '') &&
            (self.AccountKey === null || self.AccountKey === '');
        };
    };
};