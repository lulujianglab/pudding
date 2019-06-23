# blog

<% for (var date in sortPosts) { %>
#### <%= date %>
<% for (let post of sortPosts[date]) { %>
<% if (post.state === 'open') { %>
* [<%= post.title %>](https://<%= baseURL %>/posts/<%= post.title.replace(/ /g, '%20') %>.html) <% for (let label of post.labels) { %> `<%= label.name %>` <% } %>
<% } %>
<% } %>
<% } %>
Powered by PuddingNote

 
  