const usersData = {};
const groupsData = {};
$.get('http://localhost:3300/api/user/all', function (res) {
  const users = res.users;
  users.forEach(function (user) {
    const selectedUser = user.username;
    usersData[selectedUser] = null;
  });
});

$(document).ready(function() {
  $('.chips-autocomplete').material_chip({
    placeholder: 'Enter a username',
    secondaryPlaceholder: 'e.g. emmanuel',
    autocompleteOptions: {
      data: usersData,
      limit: Infinity,
      minLength: 1
    }
  });
  let members = [];
  $('.chips').on('chip.add', function (e, chip){
    members.push(chip.tag);
    document.getElementById('members').value = members;
  });

  $('.chips').on('chip.delete', function (e, chip){
    const index = members[chip.tag];
    members = members.splice(index, 1);
    document.getElementById('members').value = members;
  });

  $('.chips-autocompleteAdd').material_chip({
    placeholder: 'Enter a username',
    secondaryPlaceholder: 'e.g. Emmanuel',
    autocompleteOptions: {
      data: usersData,
      limit: Infinity,
      minLength: 1
    }
  });
  const member = [];
  $('.chip').on('chip.add', function (e, chip) {
    document.getElementById('memberrr').value = 'check';
  });

  $('.chip').on('chip.delete', function (e, chip){
    const index = member[chip.tag];
    members = member.splice(index, 1);
    document.getElementById('member').value = member;
  });
});

$(document).ready(function () {
    $('.modal').modal();
});

function hideForm() {
  alert('12345');
}
