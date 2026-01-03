export interface BrandData {
  title: string;
  slug: string;
  hex: string;
  source: string;
  aliases?: Aliases;
  guidelines?: string;
}

export interface Aliases {
  dup?: Dup[];
  old?: string[];
}

export interface Dup {
  title: string;
  hex?: string;
  source?: string;
  guidelines?: string;
}

export type Ecosystem =
  | 'Bazel'
  | 'Cargo'
  | 'Composer'
  | 'NuGet'
  | 'GitHub Actions workflows'
  | 'Go modules'
  | 'Gradle'
  | 'Julia'
  | 'Maven'
  | 'npm'
  | 'OpenTofu'
  | 'pip'
  | 'pnpm'
  | 'pub'
  | 'Poetry'
  | 'RubyGems'
  | 'Swift Package Manager'
  | 'Yarn';

export type BaseLanguage =
  | 'Starlark'
  | 'Rust'
  | 'PHP'
  | '.NET languages (C#, F#, VB), C++'
  | 'YAML'
  | 'Go'
  | 'Java'
  | 'Julia'
  | 'Java, Scala'
  | 'JavaScript'
  | 'HCL'
  | 'Python'
  | 'Dart'
  | 'Ruby'
  | 'Swift';

export type RecommendedFile =
  | '.csproj'
  | '.fsproj'
  | '.nuspec'
  | '.terraform.lock.hcl'
  | '.vbproj'
  | '.vcxproj'
  | '.yaml'
  | '.yml'
  | 'Cargo.lock'
  | 'composer.lock'
  | 'Gemfile.lock'
  | 'go.mod'
  | 'Manifest.toml'
  | 'MODULE.bazel'
  | 'package-lock.json'
  | 'Package.resolved'
  | 'pipfile.lock'
  | 'pnpm-lock.yaml'
  | 'poetry.lock'
  | 'pom.xml'
  | 'pubspec.lock'
  | 'requirements.txt'
  | 'WORKSPACE'
  | 'yarn.lock';

export interface SupportedEcosystem {
  packageManager: Ecosystem;
  languages: BaseLanguage;
  staticTransitiveDependencies: boolean;
  automaticDependencySubmission: boolean;
  recommendedFiles: RecommendedFile[];
  additionalFiles: string[];
}

export type FrameworkBrand = BrandData['title'] | Dup['title'];
export type FrameworkSlug = BrandData['slug'];
