# Code culture

Instead of having a big document describing code style and some arcane rules around that, this document will describe that we consider good practices for creating high quality software.

Overall we have one guiding rule;

> Leave the place better than you found it.

This means that if run into a `todo` comment in the code base you try to address it instead of working around it (talk to the original author or the `todo` if things aren't clear).

Don't leave issues hanging. However, if you notice things that you don't have time to fix right now, file a GitHub issue around it so at least it can be tracked and it appears in the backlog.

This is a living document, if you feel like something needs to be added, this can be done through a regular pull request.

## Communication

One of our most valuable things is our ability to help each other out. If you're stuck on a particularly difficult problem, ask around. Your team members might know the answer or at the very least will help you on your way. We've all had to learn, and we're all not done learning.

> [You Must Try, and then You Must Ask][2]

Making mistakes is OK, but own up to them and talk about them. We can all learn from these mistakes. Not mentioning problems does not make them go away, if anything it usually makes them much more visible, just not talked about. Be reliable and speak up.

Prefer group chats over DMs to avoid overburdening individuals, we have a few places where we can talk about and discuss issues, it's not considered "bothering" to ask questions - on the contrary - it's welcomed.

## Trunk based development

At Traverse we use [Trunk Based Development][1]. For us specifically it means a few things:

 * Prefer many small commits and small PRs
 * Develop in short-lived branches
 * High emphasis on fast continuous integration
 * High turnaround time on PR reviews

When we say short lived branches, we mean it. Strive for branches that live a few hours or a day instead of weeks to prevent large merges.

Don't be afraid to ask team members for reviews if you think it's taking a long time to get feedback.

If pull requests end up too big, occasionally we'll ask them to be split up for ease of reviewing, since 2 or 3 smaller PRs are much nicer to review than one big one. When in doubt, split up the pull request preemptively.

## Avoid "What-if"s

Instead of engineering for a potential future that may or may not exist, try to solve the problem at hand without introducing feature creep or without over-scoping. Tackle the problems when you have them, not sooner. This avoids lots of unneeded complexity. 

# Semantic Commit Messages

See how a minor change to your commit message style can make you a better programmer.

Format: `<type>(<scope>): <subject>`

`<scope>` is optional

## Example

```
feat: add hat wobble
^--^  ^------------^
|     |
|     +-> Summary in present tense.
|
+-------> Type: chore, docs, feat, fix, refactor, style, or test.
```

More Examples:

- `feat`: (new feature for the user, not a new feature for build script)
- `fix`: (bug fix for the user, not a fix to a build script)
- `docs`: (changes to the documentation)
- `style`: (formatting, missing semi colons, etc; no production code change)
- `refactor`: (refactoring production code, eg. renaming a variable)
- `test`: (adding missing tests, refactoring tests; no production code change)
- `chore`: (updating grunt tasks etc; no production code change)

References:

- https://www.conventionalcommits.org/
- https://seesparkbox.com/foundry/semantic_commit_messages
- http://karma-runner.github.io/1.0/dev/git-commit-msg.html

## Pull requests

We work exclusively through pull requests to increase code quality and visibility into what's going on inside the codebase. When creating a pull request, make sure it has a very clear description and title, an explanation of /why/ this pull request is needed and what it does.
Write titles and explanations in the imperative mood. To quote [git documentation] itself: `e.g. "make xyzzy do frotz" instead of "[This patch] makes xyzzy do frotz" or "[I] changed xyzzy to do frotz", as if you are giving orders to the codebase to change its behavior.`.

Add a descriptive emoji as the first character of the PR title 😎.

[git documentation]: https://git-scm.com/docs/SubmittingPatches#describe-changes

Occasionally pull requests will attract a significant amount of comments, while sometimes this is helpful to get people into the Rust language or into our codebase this can be quite overwhelming as well. Just keep in mind that none of the feedback should be targeted to the individual, but rather to the code in question.

If a comment points out an issue, bug or oversight with the current approach, think and discuss if it should be fixed in the same PR or if it should be done in a follow-up pull request at a later time.

Notice that all pull requests will be squashed and merged, so feel free to make as many commits as needed (even broken ones) in your branch before merging, they'll be rolled up into one big commit later anyway.

Don't copy and paste sections of existing code for our own codebase, instead refactor the code to fit your use case. When including external code, make sure the license is allowed and attribute the external code properly (link papers, blog posts, urls, etc). Additionally, if you spot copy & pasted code, refactor it into a shared component.

## Broken `main` branch

Occasionally it can happen that changes get merged to the `main` branch that pass our CI testing, but still break the build in some way. In that scenario, the only acceptable process is to revert the change as soon as possible, even if a fix can be found relatively fast. This unblocks the team from waiting on a single individual, while also relieving some of the pressure of having to fix the issue right then and there.

The pull request to revert a change should thus get accepted as soon as possible, and definitely not stay open for long. Ideally `Revert` PRs are instantly accepted by somebody in the team so everybody can continue their work and there is no breakage on `main` anymore.

Ideally, once a bugfix has been found, a unit test gets added to make sure we can prevent similar breakage from happening in the future.

## Code review

Whenever questions arise about a piece of code, or something requires clarification during a code review, it is expected that the answer should be given either as a code comment or by restructuring the code to make it more clear, rather than answering directly in the code review itself.

## Using and contributing to external libraries

We very much encourage open source software contributions from our developers and have a few key guidelines around contributing and usage;

 * Be an excellent community member, when contributing in other projects, so keep it professional
 * Be mindful of the project's roadmap, plans and maintainer overhead
    * Work with the project to make sure the changes live up to their standards and expectations
    * Some projects prefer tracking/discussion issues up-front, instead of a PR that may or may not be rushed to fit in a new feature. Plan ahead by reading the contributing guidelines
 * When reviewing contributions to our crates, be aware that we don't always have to accept changes if they don't fit our goals or priorities. However, communicate this nicely and clearly
 * (Especially smaller PRs) try to reply in a timely manner. The work we do at Traverse is important, but setting some time aside to show that we're serious about open source and swiftly adapting to issues is worth something, too

[1]: https://trunkbaseddevelopment.com
[2]: https://blogs.akamai.com/2013/10/you-must-try-and-then-you-must-ask.html
