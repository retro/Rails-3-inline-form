// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults
$(document).ready(function(){
  $('.editable p a').live('click', function(){
    var a = $(this);
    $.get(a.attr('href') + '.js', function(response){
      var form_wrapper = $('<div/>').html(response);
      var field_id = a.parent().attr('id').replace(/edit-/, '');
      $(form_wrapper).find('fieldset.inputs ol li:not(#' + field_id + '_input), h1, .actions').remove();
      $(form_wrapper).find('form').addClass('inline-edit');
      a.parent().after($(form_wrapper).html()).hide();
    })
    return false;
  })
  $('form.inline-edit').live('submit', function(){
    var form = $(this);
    $.ajax({
      data: $(this).serialize(),
      type: 'POST',
      url: $(this).attr('action') + '.js',
      success: function(data){
        var editing_id = form.prev().attr('id');
        form.remove();
        
        $('#' + editing_id).html($('<div/>').html(data).find('#' + editing_id)).show();
      },
      error: function(xhr){
        if(xhr.status == 422){
          var data = $('<div/>').html(xhr.responseText);
          var edited = form.find('fieldset.inputs li');
          edited.replaceWith(data.find('#' + edited.attr('id')));
        }
      }
    });
    return false;
  })
})