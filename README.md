# SpotChum Bot #

### What is this repository for? ###

* SpotChum Bot is a [Telegram](https://telegram.org/) bot that helps to determine how happy people are in your current location
* Bot address: [Telegram.me/SpotChumBot](https://telegram.me/SpotChumBot)
* [Documentation at Google Docs](https://docs.google.com/document/d/1pImUd4GyR56XXGubQDyC5ty93N3CGGq6rfi370f371A/)

### Docker containers deployment ###

~~~~
docker build -t gcr.io/serp-main/spotchumbot:v1 .
docker run --name spotchumbot -d gcr.io/serp-main/spotchumbot:v1
gcloud docker push gcr.io/serp-main/spotchumbot:v1

docker build -t gcr.io/serp-main/instcrawler:v1 .
docker run --name instcrawler -d gcr.io/serp-main/instcrawler:v1
gcloud docker push gcr.io/serp-main/instcrawler:v1

docker build -t gcr.io/serp-main/cognitive:v1 .
docker run --name cognitive -d gcr.io/serp-main/cognitive:v1
gcloud docker push gcr.io/serp-main/cognitive:v1

gcr.io/serp-main/spotchumbot:v1
gcr.io/serp-main/instcrawler:v1
gcr.io/serp-main/cognitive:v1
~~~~

### Kubernetes cluster config ###
[Kubernetes manual](http://kubernetes.io/docs/hellonode/)
[Kubernetes cluster](https://130.211.67.53/api/v1/proxy/namespaces/kube-system/services/kubernetes-dashboard/#/replicationcontrollers)

~~~~
gcloud config set project serp-main
gcloud config set compute/zone europe-west1-d
gcloud config set container/cluster cluster-serp
gcloud container clusters get-credentials cluster-serp

kubectl run spotchumbot --image=gcr.io/serp-main/spotchumbot:v1
kubectl get deployments
kubectl get pods
kubectl delete service,deployment spotchumbot
kubectl cluster-info
kubectl config view
~~~~

### Scala and Spark ###
[Write and run Spark Scala jobs on a Cloud Dataproc cluster](https://cloud.google.com/dataproc/tutorials/spark-scala#using_scala)
[BasicParseJson.scala](https://github.com/databricks/learning-spark/blob/master/src/main/scala/com/oreilly/learningsparkexamples/scala/BasicParseJson.scala)
[SparkPageRank.scala](https://github.com/apache/spark/blob/master/examples/src/main/scala/org/apache/spark/examples/SparkPageRank.scala)

~~~~
sbt run
sbt package

gs://scala-jars/SpotChumJob.jar
~~~~