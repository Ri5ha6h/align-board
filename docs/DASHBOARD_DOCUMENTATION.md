# Alignbits Dashboard

## Overview

The Alignbits Dashboard gives operations teams a shared view of shipment tracking across
multiple transportation modes. It brings carrier and terminal activity, tracking health,
latency, reference details, and operational incidents into one place so users can understand
what is being tracked and quickly investigate delays or failures.

Each transportation mode uses the same core dashboards while presenting the carriers,
terminals, queues, and reference types that are relevant to that mode. Users can switch between
production and other available environments without changing the purpose of each dashboard.

## Transportation Modes

### Ocean

Tracks ocean carriers and container-shipping activity. Ocean references can be a **Booking**,
**Bill of Lading**, or **Container**. Its queues are **Normal**, **Adaptive**, and **Reference
Not Found (RNF)**. Ocean is also the only mode with the Induced dashboard.

### Air

Tracks airlines and air-cargo activity using **Air Waybill (AWB)** references. Its queues are
**Normal** and **Reference Not Found (RNF)**.

### Terminal

Tracks port and terminal operations using **Import** and **Export** references. Its queues are
**Normal** and **Reference Not Found (RNF)**.

### Road

Tracks road carriers and trucking activity using **Less Than Truckload (LTL)** and **Full
Truckload (FTL)** references. Its queues are **Normal** and **Reference Not Found (RNF)**.

### Intermodal

Tracks carriers that move freight through more than one form of transport. It uses the
**Intermodal (INTMD)** reference type and the **Normal** and **Reference Not Found (RNF)**
queues.

### Freight

Tracks freight-forwarding activity using **House Air Waybill (HAWB)** references. Its queues
are **Normal** and **Reference Not Found (RNF)**.

### Load

Tracks load-management activity using the **Load** reference type. Load tracking uses the
**Normal** queue.

## Dashboard Components

### Status

Shows active and closed operational incidents for the selected mode and environment. Users can
review the affected carrier or terminal, issue and impact details, incident type, expected
resolution, and final resolution. Users with the required access can create, update, close, or
delete status entries.

### Summary

Provides an at-a-glance view of tracking volume and health for selected carriers or terminals.
It summarizes activity such as tracked shipments, successful and failed crawls, reference-not-
found results, data changes, processing duration, last-run timing, and queue performance.

### History

Shows the tracking history for a subscription. Users can inspect all recorded results or focus
on entries where tracking data changed, with an optional date range for narrowing the history.

### References

Helps users investigate tracked references through three views: **All References** for filtered
reference records, **Subscription** for the references associated with a subscription, and
**Reference** for a specific reference number. The available filters follow the selected
transportation mode.

### Latency

Breaks tracking results into elapsed-time ranges so users can see how quickly selected carriers
or terminals are being processed. Results can be filtered by queue and reference type, making
long-running or delayed tracking activity easier to identify.

### Induced

Displays year-based induced-latency trends for selected ocean carriers as a chart. This
dashboard is available only in Ocean mode; the other transportation modes do not provide an
Induced view.
