//Using Stripe method for the payment

// Stripe.setPublishableKey('pk_test_s4ISG5LHKv0hQPMUMPnVkb5W00QkMp55uZ');

// console.log("hello Stripe");
// var $form=$('#checkoutform');

// $form.submit((event)=>{
//     $form.find('#btn').prop('diabled',true);
//     Stripe.card.createToken({
//         number:$('#card-number').val(),
//         exp_mon:$('#card-expmon').val(),
//         exp_year:$('#card-expyear').val(),
//         cvv:$('#card-cvv').val(),
//         name:$('#cardholdername').val()
//     }, stipeResponseHandler);
//     return false;
// });

//  function stipeResponseHandler(status, response){
//      if(response.error){
//          $('#charge-error').text(response,error.message);
//          $('#charge-error').removeClass('hidden');
//          console.log("error in validation");
//          $form.find('#btn').prop('disabled',false); //Re-enable submission
//      } else{
//         //Getting the token Id
//         var token=response.id;
//         $form.append($('<input type="hidden" name="stripeToken" />').val(token));

//         //submit the form
//         $form.get(0).submit();
//      }
//  }