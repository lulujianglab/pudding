# blog

<% for (var date in sortPosts) { %>
## <%= date %>
<% for (let post of sortPosts[date]) { %>
* [<%= post.title %>](https://<%= domain %>/<%= post.title %>.html) <%= dayjs(post.createdAt).format('YYYY-MM-DD') %> <% for (let label of post.labels) { %> `<%= label.name %>` <% } %>
<% } %>
<% } %>
Powered by PuddingNote

 
  