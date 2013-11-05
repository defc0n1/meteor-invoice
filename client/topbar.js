Template.topbar.events({
    'keyup #search-query': function(event) {
        Session.set('query', event.target.value);
        Session.set('skip', 0);
    }
});
