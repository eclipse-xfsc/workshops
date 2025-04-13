# Overall design

- Two API groups:

  - all:

    - GET /mydrink
    - POST /mydrink

  - barkeepers:

    - GET /drinks

- Need barkeeper credential (1st iteration: hard-code)
- Every drink gets a self-description
- Every voter gets a single voter credential. AAS issues access tokens.
