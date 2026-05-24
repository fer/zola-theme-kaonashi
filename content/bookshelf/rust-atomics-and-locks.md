+++
title = "Rust Atomics and Locks"
description = "Concurrency in Rust from first principles — memory ordering, atomics, and lock implementation"
date = 2026-03-01

[taxonomies]
tags = ["rust", "concurrency", "systems"]

[extra]
splash = "/images/rust-atomics-cover.jpg"
author = "Mara Bos"
publisher = "O'Reilly Media"
year = 2023
isbn = "978-1-098-11944-7"
rating = 5
url = "https://marabos.nl/atomics/"
+++

_Rust Atomics and Locks_ by Mara Bos is a deep, practical guide to concurrent programming in Rust. Mara is the Rust standard library's concurrency maintainer, and this book reflects that depth of expertise.

## What it covers

### Memory Ordering

The book starts at the hardware level — what memory ordering means on modern CPUs, how compilers can reorder operations, and how Rust's memory ordering types (`Relaxed`, `Acquire`, `Release`, `AcqRel`, `SeqCst`) map to processor-level guarantees.

### Atomic Types

A thorough treatment of `AtomicBool`, `AtomicI32`, `AtomicUsize`, `AtomicPtr`, and the newer `AtomicU64` and friends. Each type is examined with practical examples showing when to use which atomic operation.

### Building Locks from Atomics

The book walks through implementing every major lock primitive from scratch: `Mutex`, `RwLock`, `Condvar`, and once-cells. Each implementation reveals the tradeoffs between fairness, throughput, and memory overhead.

### Lock-Free Data Structures

Beyond locks, the book covers lock-free stacks, queues, and hazard pointers — data structures that avoid blocking entirely by using careful atomic operations.

### The C++20 Memory Model

Rust's memory model is inherited from C++20. The book explains the formal model behind it, how `Ordering` relates to happens-before relationships, and how to reason about correctness in concurrent code.

## Why it matters

This is the definitive resource on Rust concurrency. Mara Bos's experience as the standard library's concurrency maintainer means every page is grounded in real implementation decisions. The book is available for free online and is equally valuable as a cover-to-cover read and as a reference for specific topics.
