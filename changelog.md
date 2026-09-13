# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.0] - 2026-09-13

### Changed

- Upgraded Next.js from 15.2.3 to 16.3.5. Builds now use Turbopack, and linting runs the ESLint CLI directly since Next 16 removed the `next lint` command.

### Security

- Resolved all 88 open Dependabot alerts by updating Next.js and its transitive dependencies (js-yaml, postcss, sharp, nanoid, brace-expansion, minimatch, picomatch, flatted, @humanfs/node) to patched versions.

## [1.0.1] - 2024-03-24

## Fixed

- Fixed a visual bug in Safari where the output text diacritical marks were not updating correctly when they were outside the line of text's X height.

## [1.0.0] - 2024-03-23

- Initial release
