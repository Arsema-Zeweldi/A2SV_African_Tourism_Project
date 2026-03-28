import 'package:flutter/material.dart';

class FilterBottomSheet extends StatefulWidget {
  final Function(Map<String, dynamic>) onApplyFilters;

  const FilterBottomSheet({super.key, required this.onApplyFilters});

  @override
  State<FilterBottomSheet> createState() => _FilterBottomSheetState();
}

class _FilterBottomSheetState extends State<FilterBottomSheet> {
  RangeValues _budgetRange = const RangeValues(0, 1000);
  int? _durationDays;
  String? _groupSize;
  String? _sortBy = 'rating_avg';
  String? _order = 'desc';

  final List<String> _groupSizes = ['Solo', 'Couple', 'Family', 'Group', 'All'];
  final List<Map<String, String>> _sortOptions = [
    {'label': 'Rating', 'field': 'rating_avg', 'order': 'desc'},
    {'label': 'Price (Low to High)', 'field': 'price', 'order': 'asc'},
    {'label': 'Price (High to Low)', 'field': 'price', 'order': 'desc'},
    {'label': 'Newest', 'field': 'created_at', 'order': 'desc'},
  ];

  @override
  Widget build(BuildContext context) {
    final orange = const Color(0xFFF39233);

    return Theme(
      data: Theme.of(context).copyWith(
        colorScheme: Theme.of(context).colorScheme.copyWith(
              primary: orange,
              secondary: orange,
            ),
        inputDecorationTheme: InputDecorationTheme(
          focusedBorder: OutlineInputBorder(
            borderSide: BorderSide(color: orange),
            borderRadius: BorderRadius.circular(8),
          ),
          enabledBorder: OutlineInputBorder(
            borderSide: BorderSide(color: Colors.grey.shade300),
            borderRadius: BorderRadius.circular(8),
          ),
        ),
      ),
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Filter Packages',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                IconButton(
                  icon: const Icon(Icons.close),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
            const Divider(),
            // Budget range slider
            const Text('Budget (USD)'),
            RangeSlider(
              values: _budgetRange,
              min: 0,
              max: 2000,
              divisions: 20,
              labels: RangeLabels(
                '\$${_budgetRange.start.round()}',
                '\$${_budgetRange.end.round()}',
              ),
              activeColor: orange,
              inactiveColor: Colors.grey.shade300,
              onChanged: (values) => setState(() => _budgetRange = values),
            ),
            const SizedBox(height: 12),
            // Duration picker
            const Text('Duration (days)'),
            DropdownButtonFormField<int?>(
              value: _durationDays,
              hint: const Text('Any'),
              items: [null, 1, 2, 3, 4, 5, 6, 7, 10, 14, 21]
                  .map((e) => DropdownMenuItem(
                        value: e,
                        child: Text(e == null ? 'Any' : '$e days'),
                      ))
                  .toList(),
              onChanged: (value) => setState(() => _durationDays = value),
              decoration: InputDecoration(
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
              ),
            ),
            const SizedBox(height: 12),
            // Group size picker
            const Text('Group Size'),
            DropdownButtonFormField<String?>(
              value: _groupSize,
              hint: const Text('Any'),
              items: [null, ..._groupSizes]
                  .map((e) => DropdownMenuItem(
                        value: e,
                        child: Text(e ?? 'Any'),
                      ))
                  .toList(),
              onChanged: (value) => setState(() => _groupSize = value),
              decoration: InputDecoration(
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
              ),
            ),
            const SizedBox(height: 12),
            // Sort by
            const Text('Sort By'),
            DropdownButtonFormField<Map<String, String>>(
              value: _sortOptions.firstWhere(
                (opt) => opt['field'] == _sortBy && opt['order'] == _order,
                orElse: () => _sortOptions.first,
              ),
              items: _sortOptions.map((opt) {
                return DropdownMenuItem(
                  value: opt,
                  child: Text(opt['label']!),
                );
              }).toList(),
              onChanged: (opt) {
                if (opt != null) {
                  setState(() {
                    _sortBy = opt['field'];
                    _order = opt['order'];
                  });
                }
              },
              decoration: InputDecoration(
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
              ),
            ),
            const SizedBox(height: 24),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () {
                      setState(() {
                        _budgetRange = const RangeValues(0, 1000);
                        _durationDays = null;
                        _groupSize = null;
                        _sortBy = 'rating_avg';
                        _order = 'desc';
                      });
                    },
                    style: OutlinedButton.styleFrom(
                      side: BorderSide(color: orange),
                    ),
                    child: const Text('Reset'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.pop(context);
                      widget.onApplyFilters({
                        'min_price': _budgetRange.start,
                        'max_price': _budgetRange.end,
                        'duration_days': _durationDays,
                        'group_size': _groupSize,
                        'sort_by': _sortBy,
                        'order': _order,
                      });
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: orange,
                      foregroundColor: Colors.white,
                    ),
                    child: const Text('Apply Filters'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}