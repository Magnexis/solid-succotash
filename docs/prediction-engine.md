# Prediction engine

The shared deterministic rules engine lives in `shared/` and is consumed by both Express and the frontend offline fallback. It starts with an evidence-informed lifestyle radius, expands it for selected circumstances, and scores a catalog of hiding places using environment, personality, weather, and escape-event signals.

Feature-specific places such as porches, sheds, garages, apartments, drains, woods, and fields are only recommended when the owner reports them nearby. The dashboard displays the radius, ranked zones, per-zone ranking points, and an explanation of the signals used.

The radius and common location categories are informed by Huang et al., *Search Methods Used to Locate Missing Cats and Locations Where Missing Cats Are Found*, Animals 2018, 8(1), 5: https://doi.org/10.3390/ani8010005.

A production model should version rules, cite behavioral evidence, log which rules fired, and clearly state that guidance is probabilistic rather than a guarantee.
