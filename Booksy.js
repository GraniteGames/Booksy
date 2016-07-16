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
Router.route('/delete', {
    template:'deletePage',
    name: 'delete'
})
Router.route('/deleteSuccess',{
  template: 'deleteSuccess',
  name: 'deleteSuccess'
})
Router.configure({
  layoutTemplate: 'main'

});
//END Routing


//Globals
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
    },


  });
  Template.resultPop.helpers({

    sellerSession: function(name){
        return Session.get(name);
      }
  });

  Template.resultPop.events({
    "click .buyerSubmit": function(event, template)
    {
      event.preventDefault();
      //Get Seller Email
      var sellerEmail = Session.get("currentSellerEmail");
      var sellerEmail = sellerEmail.toString();
      //Get buyer email
      var buyerEmail = $('#buyerEmail').val();
      var buyerEmail = buyerEmail.toString();
      //Get Buyer Message
      var buyerText = $('#emailContent').val()
      var buyerText = buyerText.toString() + '. If you would like to delete your book from our listing, follow this link ( http://booksybeta.herokapp.com/delete ) and paste : ' + Session.get('bookID') + 'into the available field' ;
      var emailTitle = 'Booksy: Reply to your ad for: ' + Session.get("sellerTitle");
      // Call email method
      Meteor.call('sendEmail',sellerEmail, buyerEmail,emailTitle,buyerText);
      //Switch up modal message
      $('.buyerSubmit').hide();
      $('.fg2').hide();
      $('.fg1').hide();
      $('.modal-body').append('<p>Thanks for using Booksy!</p>');
      console.log("Email Sent");
    },
    "click .modalClose": function(event, template)
    {
      event.preventDefault();
      $('.modal-body').remove('p');
      $('.buyerSubmit').show();
      $('.fg1').show();
      $('.fg2').show();
      $('.textMessage').val('');
    }

  })

  Template.resultsPage.events({
    "click .toContact": function(event,template)
    {
      event.preventDefault();
      var sellerID = event.currentTarget.dataset.id;
      console.log("seller id logged");
      console.log(sellerID);
      var sellerData = BooksList.findOne({ _id : sellerID});
      console.log(sellerData.bookTitle);
      Session.set({
        bookID: sellerData._id,
        sellerTitle: sellerData.bookTitle,
        sellerAuthor: sellerData.bookAuthor,
        sellerIsbn : sellerData.isbn,
        sellerRegion: sellerData.region,
        sellerDatePosted: sellerData.dateCreated,
        currentSellerEmail: sellerData.sellerEmail,
        sellerPrice: sellerData.bookPrice
      });

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
  },
  "click .delete": function (event,template)
  {
    event.preventDefault();
    Router.go("/")
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
    var pricePost = event.target.bookPrice.value;

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
    Meteor.call("addBook", regionPost,isbnPost,titlePost,authorPost,tagPost,emailPost, pricePost);

    Router.go('/thanks');
    console.log("thanks page Displayed");
  },
 /*   "change .myFileInput": function (event,template){
      var files= event.target.files;
      for (var i=0, ln=files.length; i < ln; i++){
        Images.insert(files[i],function(err, fileObj){
            console.log("images inserted")
        });
      }
    },*/
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
        results:'specific'
      });
    }
    Router.go('/results')
  console.log("Results page Displayed")
}
});

Template.deletePage.events({
  "submit form": function (event,template){
    event.preventDefault();
    var deleteId = event.target.deleteInput.value;
    if (BooksList.findOne(deleteId))
    {
      Meteor.call("deletebook", deleteId);
      console.log("book Removed")
      Router.go('/deleteSuccess');
    }
    else{
      $(".error").append("<p>Error: Invalid Code</p>");
    }
  }

});
Template.deleteSuccess.events({
  'click .return': function (event, template){
    event.preventDefault();
    Router.go('/')
  }
})
}
//methods

Meteor.methods({
addBook: function  (regionPost, isbnPost, titlePost, authorPost, tagPost, emailPost, pricePost)
{
  BooksList.insert({
    bookTitle: titlePost,
    bookAuthor: authorPost,
    isbn : isbnPost,
    sellerEmail: emailPost,
    subjectTag: tagPost,
    region: regionPost,
    price: pricePost,
    dateCreated: new Date()
  });
},
sendEmail: function (to,fr,subject,text){
  check([to, fr, subject, text], [String]);

  this.unblock();

  Email.send({
    to:to,
    from:fr,
    subject: subject,
    text: text
  });
},
deletebook: function(id)
{
  BooksList.remove(id);
}


});
if (Meteor.isServer) {
  Meteor.startup(function () {
   process.env.MAIL_URL="smtp://postmaster@sandbox017d063d7d684ed5af85afc1b622a6c0.mailgun.org:548426b1d23a17500b5e117414700ad2@smtp.mailgun.org:587/";
  });
}
