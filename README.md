

# Boilerplate
### Very watered down from 10 minutes of composition


## Attaching Events

Every view type class should have a method for `attachEvents` and `detachEvents`.
This allows us to control the hooks from the router and other places very clearly.
Some people would put `x.on('', '')` in initialization, but this is prone to doubling
up and is not easy disable where necessary.


## Router

The router has built in transitional functionality that will coordinate how a view
has events detached, transitions in and out, fetching of remote resources, etc in
order to provide a smooth single page experience.


## Main

Main is a junk drawer of variables, flags, settings, constants, etc that most
apps use or might use.


## Shorthand

There are some variables setup for shorthand like `a` and `p` which helps us easily
debug things from the command line. You could write things like:
`p.views("side-module list header").$el` to dive deep into subviews. If you're not
familiar with it, it may seem "So what," but it is a highly valuable resource in debugging.


## Page, View, Subview

Each level should be responsible for what it's allowed to do. This boilerplate has been
quickly compiled from an app that.. sometimes follows the rules. A `page` should be controlling
the overall state of the page. It's made up of a bunch of `view`s, like lists, side modules,
ui elements, etc. Each `view` may have a bunch of `subviews` such as a list having list items.
In that case, you'd write something like:

```
    # within Page
    this.views.add(new namespace.View_List({
        collection: this.collection
    }, 'list');

    ---------

    # within View_List
    this.collection.each(function(model, index) {
        this.views.add(new namespace.View_List_Item({
            model: model
        }, 'item-' + index);
    }, this);

```

The second parameter allows you to talk to the view directly, such as:
`this.views('list')` or `this.views('list item-0')`.
The shorthand of that is also `this.$v('list item-0')`.


## Beyond

There are countless benefits to an approach like this. It has made development of
complex apps not only fast and clearly written, but enjoyable to write in. It's
very structurally sound, clean, and properly delegated without overstepping the
boundaries of each technology's (html, css, js, etc) purpose.


