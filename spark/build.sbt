libraryDependencies += "org.apache.spark" %% "spark-core" % "1.6.1"

artifactName := { (sv: ScalaVersion, module: ModuleID, artifact: Artifact) =>
  "SpotChumJob.jar" }
