package com.spugachev.spotchum

import org.apache.spark._
import scala.util.parsing.json._

object SpotChumJob {
  def main(args: Array[String]): Unit = {
	val sparkConf = new SparkConf()
    val sc = new SparkContext(sparkConf)

	val text_file = sc.textFile("gs://cognitive-data/8fd3fb0f-7089-4035-8e0f-79f0336f347f.txt")
	
	val resData = text_file.map(line => 
	JSON.parseFull(line).get.asInstanceOf[Map[String, Map[String, Map[String, Option[String]]]]]).map(json => 
	(json.get("post").get("location").getOrElse("latitude","") + "::" + json.get("post").get("location").getOrElse("longitude","").toString()
	, json.get("cognitive").get("scores").getOrElse("happiness", "0").toString().toFloat))
	val resMean = resData.groupByKey().mapValues { vals =>
	          val n = vals.count(x => true)
	          val sum = vals.sum
	          val avg = sum / n
	          avg
	        }
	
	resMean.collect
	resMean.saveAsTextFile("gs://spark-out/mean-out-"+(System.currentTimeMillis / 1000)+"/")
  }
}
