import 'package:shared_preferences/shared_preferences.dart';

class SavedPackagesLocalDataSource {
  static const String _key = 'saved_packages';

  final SharedPreferences _prefs;

  SavedPackagesLocalDataSource(this._prefs);

  Future<void> addSavedPackage(String packageId) async {
    final saved = _prefs.getStringList(_key) ?? [];
    if (!saved.contains(packageId)) {
      saved.add(packageId);
      await _prefs.setStringList(_key, saved);
    }
  }

  Future<void> removeSavedPackage(String packageId) async {
    final saved = _prefs.getStringList(_key) ?? [];
    saved.remove(packageId);
    await _prefs.setStringList(_key, saved);
  }

  Future<List<String>> getSavedPackageIds() async {
    return _prefs.getStringList(_key) ?? [];
  }

  Future<bool> isSaved(String packageId) async {
    final saved = await getSavedPackageIds();
    return saved.contains(packageId);
  }
}