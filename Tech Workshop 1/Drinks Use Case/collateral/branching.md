# Branching and merging strategy

- Naming convention `team{1..7}/foo`
- Follow [trunk-based development](https://trunkbaseddevelopment.com/) - w/o
release branches.
- Create feature flags:

  - Back-end example: API endpoint without implementation in one merge,
  implementation of endpoints in separate merges
  - Front-end example: Separate UI into pieces (e.g. tabs), create MRs for the
  implementation of each.
