How to use
----------

- Install yeoman if not installed: 'npm install yeoman -g'
- Clone the repo
- 'yeoman server'


Bugs known
-------------

- QEMU dataset breaks wiggle GET request
- VNC
- Tooltip bug:  http://cl.ly/image/0i032X010U0S: triggered it by scrolling up and down over tool tips for a while in multi directions.


Features missing
-------------
- Manage User & Groups stuff
- Show when was the vm created (requires: wiggle to send created_at field)
- Use logos based on the OS, not thei name (requires: wiggle to send the OS of the dataset)


Things that could be done
--------------------------
- When another user creates a VM, show the new vm in the list (requires: howl to notify 'look, there is a new channel')
  (Security considerations)


Inspiration
-----------
- Checkout mongohq.com UX
- http://project-fifo.net/display/PF/Cool+AngularJS+Snippets