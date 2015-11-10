var React = require('react');
var ReactDOM = require('react-dom');
var moment = require('moment');
var Parse = require('parse');
var ParseReact = require('parse-react');
var Gravatar = require('react-gravatar');
moment.locale('fr', {
    months : "janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),
    monthsShort : "janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),
    weekdays : "dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),
    weekdaysShort : "dim._lun._mar._mer._jeu._ven._sam.".split("_"),
    weekdaysMin : "Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),
    longDateFormat : {
        LT : "HH:mm",
        LTS : "HH:mm:ss",
        L : "DD/MM/YYYY",
        LL : "D MMMM YYYY",
        LLL : "D MMMM YYYY LT",
        LLLL : "dddd D MMMM YYYY LT"
    },
    calendar : {
        sameDay: "[Aujourd'hui à] LT",
        nextDay: '[Demain à] LT',
        nextWeek: 'dddd [à] LT',
        lastDay: '[Hier à] LT',
        lastWeek: 'dddd [dernier à] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : "dans %s",
        past : "il y a %s",
        s : "quelques secondes",
        m : "une minute",
        mm : "%d minutes",
        h : "une heure",
        hh : "%d heures",
        d : "un jour",
        dd : "%d jours",
        M : "un mois",
        MM : "%d mois",
        y : "une année",
        yy : "%d années"
    },
    ordinalParse : /\d{1,2}(er|ème)/,
    ordinal : function (number) {
        return number + (number === 1 ? 'er' : 'ème');
    },
    meridiemParse: /PD|MD/,
    isPM: function (input) {
        return input.charAt(0) === 'M';
    },
    // in case the meridiem units are not separated around 12, then implement
    // this function (look at locale/id.js for an example)
    // meridiemHour : function (hour, meridiem) {
    //     return /* 0-23 hour, given meridiem token and hour 1-12 */
    // },
    meridiem : function (hours, minutes, isLower) {
        return hours < 12 ? 'PD' : 'MD';
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

Parse.initialize("q1VRS1NY0PBKBkMZDI2O2TVAOI8qCzcPRBbgi5rJ","CRgBAV9ilECWMLzf7un3zjGIkhKrvuQFRRBZP2es");
var CommentBox = React.createClass({
  mixins: [ParseReact.Mixin],
  observe: function() {
     return {
       comments: (new Parse.Query("Comment")).equalTo("title", this.props.title).descending("createdAt")
     };
   },
 //  loadCommentsFromServer: function() {
 //   $.ajax({
 //     url: this.props.url,
 //     dataType: 'json',
 //     cache: false,
 //     success: function(data) {
 //       this.setState({data: data});
 //     }.bind(this),
 //     error: function(xhr, status, err) {
 //       console.error(this.props.url, status, err.toString());
 //     }.bind(this)
 //   });
 // },
 handleCommentSubmit: function(comment) {
   // Create a new Comment object
   ParseReact.Mutation.Create("Comment", {text: comment.text, author: comment.author, email: comment.email, title: this.props.title }).dispatch();
 },
  render: function() {
    return (
      <div className="commentBox">
      <h6 className="er_toc_tag" id="er-toc-id-1">Commentaires</h6>
       <CommentList data={this.data.comments} />
      <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
      </div>
    );
  }
});

var Comment = React.createClass({
  rawMarkup: function() {
   var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
   return { __html: rawMarkup };
  },
  render: function() {
    var formattedDate = moment(this.props.createdAt).format('LLLL');
    return (



      <div className="comment">
        <div className="comment-image">
        <Gravatar email={this.props.email} size={100}></Gravatar>

        </div>
        <div className="comment-content">
          <h1>{this.props.author}</h1>
          <span dangerouslySetInnerHTML={this.rawMarkup()} />
          <p className="comment-detail">{formattedDate}</p>
        </div>
      </div>
    );
  }
});

var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function (comment) {
     return (
       <Comment author={comment.author} email={comment.email} createdAt={comment.createdAt}>
         {comment.text}
       </Comment>
     );
   });
    return(
      <div className="commentList">
       {commentNodes}
      </div>
    );
  }
});

var CommentForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var author = this.refs.author.value.trim();
    var text = this.refs.text.value.trim();
    var email = this.refs.email.value.trim();
    if (!text || !author || !email) {
      return;
    }
    this.props.onCommentSubmit({author: author, text: text, email: email});
    this.refs.author.value = '';
    this.refs.email.value = '';
    this.refs.text.value = '';
    return;
  },
  render: function()  {
    return (
     <form className="commentForm" onSubmit={this.handleSubmit}>
       <input type="text" placeholder="Nom" ref="author" required />
       <input type="email" placeholder="Email" ref="email" required/>
       <textarea id="comment" placeholder="Commentaire" name="comment" cols="45" rows="8" aria-required="true" ref="text" required></textarea>
       <input type="submit" value="Laisser un commentaire" />
     </form>
   );
  }
});

var TurnOver = window.TurnOver || {};
TurnOver.showComments = function(title) {
  ReactDOM.render(
     <CommentBox title={title} pollInterval={2000} />,
     document.getElementById('comments')
  );
}
window.TurnOver = TurnOver;
