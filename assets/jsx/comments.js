var React = require('react');
var ReactDOM = require('react-dom');
var Parse = require('parse');
var ParseReact = require('parse-react');

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
   ParseReact.Mutation.Create("Comment", {text: comment.text, author: comment.author, title: this.props.title }).dispatch();
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
    return (


      <div className="comment">
        <div className="comment-image">
          <img src="https://raw.githubusercontent.com/thoughtbot/refills/master/source/images/placeholder_logo_1.png" alt="Logo image"></img>
        </div>
        <div className="comment-content">
          <h1>{this.props.author}</h1>
          <span dangerouslySetInnerHTML={this.rawMarkup()} />
          <p className="comment-detail">{this.props.author}</p>
        </div>
      </div>
    );
  }
});

var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function (comment) {
     return (
       <Comment author={comment.author}>
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
    if (!text || !author) {
      return;
    }
    this.props.onCommentSubmit({author: author, text: text});
    this.refs.author.value = '';
    this.refs.text.value = '';
    return;
  },
  render: function()  {
    return (
     <form className="commentForm" onSubmit={this.handleSubmit}>
       <input type="text" placeholder="Nom" ref="author" />
       <textarea id="comment" placeholder="Commentaire" name="comment" cols="45" rows="8" aria-required="true" ref="text"></textarea>
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
