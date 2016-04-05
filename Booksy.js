//Router Stuff
Router.route('/', {
    template: 'homePage',
    name: 'home'
});
Router.route('/post', {
    template: 'postBookPage',
    name: 'post'
});
Router.route('/find', {
    template: 'findBookPage',
    name: "find"
});
Router.route('/about', {
    template: 'aboutPage',
    name: 'about'
});
Router.route('/results', {
    template: 'resultsPage',
    name: 'results'
});
Router.route('/thanks', {
    template: 'finished',
    name: 'thanks'
});
Router.configure({
  layoutTemplate: 'main'

});
//END Routing

//var pageEnum = Object.freeze({"Home":1, "Find":2, "Post":3, "Results":4, "About":5, "Thanks:":6 })
BooksList = new Mongo.Collection("books");
if (Meteor.isClient) {
Template.body.onRendered( function() {

  });

  Template.body.events({

  });

  Template.main.helpers({

    });

  //This template helper takes parameters from the session variable set in findBook, and runs a search on it, passing the data to the results handlbars
Template.resultsPage.helpers({
  booksSR: function() {
    if (Session.get('results')==="allFromRegion")
    {
      return BooksList.find({
      region: Session.get('region')
      });
    }
    else{
    return BooksList.find({

            region: Session.get('region'),
          $or: [ {isbn: Session.get('isbn')},
                { bookTitle: Session.get('bookTitle') },
                { bookAuthor: Session.get('bookAuthor')}
              ]
             });
            }
        },
   booksRelated: function () {
    return BooksList.find({
   //Search Algorithm:
      subjectTag: Session.get('subjectTag')
    });
    "click .toPost": function(event,template)
    {
      event.preventDefault();
      var sellerID = this.getAttribute('data-book-identifier');
    }

   //Search algorithm using the Session variable set in FIND
   console.log("resultsHelper")
  }
  });

Template.finished.events({
  "click .backToHome": function (event, template)
  {
    event.preventDefault();
    Router.go('/');
  }
});
Template.homePage.events({
  "click .toPost": function(event,template)
  {
    event.preventDefault
    Router.go("/post");
  }
});
Template.homePage.events({
  "click .toFind": function(event,template)
  {
    event.preventDefault
    Router.go("/find");
  }
});
Template.postBookPage.events({
  "submit form": function (event, template) {
    // Prevent default browser form submit
    event.preventDefault();
    console.log("event running");
    // Get values from form elements
    var regionPost = event.target.regionSel.value;
    console.log("Values Adding");
    var emailPost = event.target.email.value;
    var titlePost = event.target.bookTitle.value;
    var authorPost = event.target.bookAuthor.value;
    var isbnPost = event.target.isbn.value;
    var tagPost = event.target.tag.value;
    if(isbnPost=== "")
    {
      isbnPost="N/A";
    }
    if(authorPost==="")
    {
      authorPost="N/A"
    }
    if (titlePost==="")
    {
      titlePost=="N/A"
    }
    Meteor.call("addBook", regionPost,isbnPost,titlePost,authorPost,tagPost,emailPost);

    Router.go('/thanks');
    console.log("thanks page Displayed");
  }
});

Template.findBookPage.events({
    "submit form": function (event, template) {
      event.preventDefault();
      // Get values from form elements
    var regionFind = event.target.regionSel.value;
      console.log("Values Adding");
      var titleFind = event.target.bookTitle.value;
      var authorFind = event.target.bookAuthor.value;
      var isbnFind = event.target.isbn.value;
      var tagFind = event.target.tag.value;
      console.log("Find Vars set, session doing up")
   if(titleFind==="" && authorFind ==="" && isbnFind ==="" && tagFind==="None")
      {
        Session.set({
          region: regionFind,
          results: "allFromRegion"
        });
        console.log("allresults");
      }
      else{
      Session.set({
        bookTitle: titleFind,
        bookAuthor: authorFind,
        isbn : isbnFind,
        subjectTag: tagFind,
        region: regionFind,
        dateCreated: new Date(),
        documentId : _id,
        results:'specific'
      });
    }
    Router.go('/results')
  console.log("Results page Displayed")
}
});
}
//methods

Meteor.methods({
addBook: function  (regionPost, isbnPost, titlePost, authorPost, tagPost, emailPost)
{
  BooksList.insert({
    bookTitle: titlePost,
    bookAuthor: authorPost,
    isbn : isbnPost,
    sellerEmail: emailPost,
    subjectTag: tagPost,
    region: regionPost,
    dateCreated: new Date()
  });
}


})
if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
